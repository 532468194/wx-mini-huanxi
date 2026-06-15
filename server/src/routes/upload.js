const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.post('/image', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '没有上传文件' });
  res.json({
    url: '/uploads/' + req.file.filename,
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size,
  });
});

router.post('/images', authMiddleware, upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: '没有上传文件' });
  const files = req.files.map(f => ({
    url: '/uploads/' + f.filename,
    filename: f.filename,
    originalname: f.originalname,
    size: f.size,
  }));
  res.json({ files });
});

module.exports = router;
