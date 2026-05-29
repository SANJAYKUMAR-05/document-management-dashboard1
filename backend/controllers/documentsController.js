const path = require('path');
const fs = require('fs');
const { Document, Notification } = require('../models');

const createNotification = async (message, type = 'info') => {
  const note = await Notification.create({ message, type });
  return note;
};

exports.uploadDocuments = async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ message: 'No files uploaded' });

    // bulk logic
    if (files.length > 3) {
      const msg = `Upload in progress — processing ${files.length} files in background.`;
      await createNotification(msg, 'info');
      req.app.get('io').emit('notification_created', { message: msg, type: 'info' });
    }

    const saved = [];

    for (const file of files) {
      // mark processing
      const doc = await Document.create({
        filename: file.filename,
        originalname: file.originalname,
        filepath: path.join('uploads', file.filename).replace(/\\/g, '/'),
        filesize: file.size,
        mimetype: file.mimetype,
        uploadStatus: 'processing'
      });

      // emit per-file start
      req.app.get('io').emit('upload_started', { id: doc.id, name: doc.originalname });

      // simulate processing progress
      req.app.get('io').emit('upload_progress', { id: doc.id, progress: 50 });

      // finalize
      await doc.update({ uploadStatus: 'completed' });
      req.app.get('io').emit('upload_progress', { id: doc.id, progress: 100 });
      req.app.get('io').emit('upload_completed', { id: doc.id, name: doc.originalname });

      saved.push(doc);
    }

    if (files.length > 3) {
      const msg = `${files.length} files uploaded successfully`;
      await createNotification(msg, 'success');
      req.app.get('io').emit('notification_created', { message: msg, type: 'success' });
    }

    res.json({ message: 'Files uploaded', files: saved });
  } catch (err) {
    console.error(err);
    req.app.get('io').emit('upload_failed', { error: err.message });
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

exports.listDocuments = async (req, res) => {
  try {
    const docs = await Document.findAll({ order: [['createdAt', 'DESC']] });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list documents' });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Document.findByPk(id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(__dirname, '..', doc.filepath);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found on server' });

    res.download(filePath, doc.originalname);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Download failed' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Document.findByPk(id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(__dirname, '..', doc.filepath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await doc.destroy();
    req.app.get('io').emit('document_deleted', { id });

    res.json({ message: 'Document deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Deletion failed' });
  }
};
