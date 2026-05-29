const { Notification } = require('../models');

exports.listNotifications = async (req, res) => {
  try {
    const notes = await Notification.findAll({ order: [['createdAt', 'DESC']] });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load notifications' });
  }
};

exports.markRead = async (req, res) => {
  try {
    const id = req.params.id;
    const note = await Notification.findByPk(id);
    if (!note) return res.status(404).json({ message: 'Notification not found' });
    await note.update({ read: true });
    req.app.get('io').emit('notification_read', { id });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.update({ read: true }, { where: { read: false } });
    req.app.get('io').emit('notifications_read_all');
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to mark all as read' });
  }
};
