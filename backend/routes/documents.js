const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const controller = require('../controllers/documentsController');

// single or multiple
router.post('/upload', upload.array('files'), controller.uploadDocuments);
router.get('/', controller.listDocuments);
router.get('/download/:id', controller.downloadDocument);
router.delete('/:id', controller.deleteDocument);

module.exports = router;
