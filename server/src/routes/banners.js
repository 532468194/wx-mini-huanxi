const express = require('express');
const { getDb } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const banners = getDb().prepare(
    'SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC'
  ).all();
  res.json(banners);
});

router.get('/all', authMiddleware, (req, res) => {
  const banners = getDb().prepare('SELECT * FROM banners ORDER BY sort_order ASC').all();
  res.json(banners);
});

router.post('/', authMiddleware, (req, res) => {
  const { title, subtitle, image_url, link, sort_order } = req.body;
  if (!image_url) return res.status(400).json({ error: '图片地址不能为空' });
  const result = getDb().prepare(
    'INSERT INTO banners (title, subtitle, image_url, link, sort_order) VALUES (?, ?, ?, ?, ?)'
  ).run(title, subtitle, image_url, link, sort_order || 0);
  res.status(201).json(getDb().prepare('SELECT * FROM banners WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', authMiddleware, (req, res) => {
  const { title, subtitle, image_url, link, sort_order, is_active } = req.body;
  getDb().prepare(
    'UPDATE banners SET title=?, subtitle=?, image_url=?, link=?, sort_order=?, is_active=? WHERE id=?'
  ).run(title, subtitle, image_url, link, sort_order, is_active ? 1 : 0, req.params.id);
  res.json(getDb().prepare('SELECT * FROM banners WHERE id = ?').get(req.params.id));
});

router.delete('/:id', authMiddleware, (req, res) => {
  getDb().prepare('DELETE FROM banners WHERE id = ?').run(req.params.id);
  res.json({ message: '轮播图已删除' });
});

module.exports = router;
