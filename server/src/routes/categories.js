const express = require('express');
const { getDb } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const categories = getDb().prepare(`
    SELECT c.*, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
    GROUP BY c.id
    ORDER BY c.sort_order ASC
  `).all();
  res.json(categories);
});

router.post('/', authMiddleware, (req, res) => {
  const { name, slug, description, cover_image, sort_order } = req.body;
  if (!name || !slug) return res.status(400).json({ error: '分类名称和slug不能为空' });
  const result = getDb().prepare(
    'INSERT INTO categories (name, slug, description, cover_image, sort_order) VALUES (?, ?, ?, ?, ?)'
  ).run(name, slug, description, cover_image, sort_order || 0);
  res.status(201).json(getDb().prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name, slug, description, cover_image, sort_order } = req.body;
  getDb().prepare(
    'UPDATE categories SET name=?, slug=?, description=?, cover_image=?, sort_order=? WHERE id=?'
  ).run(name, slug, description, cover_image, sort_order, req.params.id);
  res.json(getDb().prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id));
});

router.delete('/:id', authMiddleware, (req, res) => {
  const count = getDb().prepare('SELECT COUNT(*) as c FROM products WHERE category_id = ? AND is_active = 1').get(req.params.id);
  if (count.c > 0) return res.status(400).json({ error: '该分类下有在售商品，请先处理' });
  getDb().prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ message: '分类已删除' });
});

module.exports = router;
