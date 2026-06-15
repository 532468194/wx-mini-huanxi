const express = require('express');
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const STATIC_DIR = path.resolve(__dirname, '../../../picture/huanxitianzhu/huanxitianzhu');

// Admin: browse static image directory
router.get('/browse', authMiddleware, (req, res) => {
  const subdir = req.query.dir || '';
  const fullPath = path.join(STATIC_DIR, subdir);

  // Security: prevent path traversal
  if (!fullPath.startsWith(STATIC_DIR)) {
    return res.status(403).json({ error: '非法路径' });
  }

  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: '目录不存在' });
  }

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  const dirs = [];
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory()) {
      dirs.push({ name: entry.name, type: 'dir', path: path.join(subdir, entry.name).replace(/\\/g, '/') });
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
        const relPath = path.join(subdir, entry.name).replace(/\\/g, '/');
        files.push({
          name: entry.name,
          type: 'file',
          path: relPath,
          url: '/static/' + relPath,
        });
      }
    }
  }

  res.json({ dirs, files, current: subdir });
});

module.exports = router;
