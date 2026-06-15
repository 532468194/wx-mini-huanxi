const express = require('express');
const { getDb } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public: list products
router.get('/', (req, res) => {
  const { category, featured, page = 1, limit = 20, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let where = 'WHERE p.is_active = 1';
  const params = [];

  if (category) {
    where += ' AND c.slug = ?';
    params.push(category);
  }
  if (featured === '1') {
    where += ' AND p.featured = 1';
  }
  if (search) {
    where += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.subtitle LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const countSql = `SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${where}`;
  const { total } = getDb().prepare(countSql).get(...params);

  const sql = `
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${where}
    ORDER BY p.featured DESC, p.sort_order ASC, p.created_at DESC
    LIMIT ? OFFSET ?
  `;
  const products = getDb().prepare(sql).all(...params, parseInt(limit), offset);

  res.json({
    data: products.map(parseProduct),
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
  });
});

// Public: single product
router.get('/:id', (req, res) => {
  const product = getDb().prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ? AND p.is_active = 1
  `).get(req.params.id);

  if (!product) return res.status(404).json({ error: '商品不存在' });

  // Record product view
  try {
    getDb().prepare('INSERT INTO analytics (event_type, product_id, ip) VALUES (?, ?, ?)').run(
      'product_view', product.id, req.ip
    );
  } catch {}

  // Get related products (same category)
  const related = getDb().prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
    ORDER BY p.featured DESC, RANDOM()
    LIMIT 4
  `).all(product.category_id, product.id);

  res.json({ product: parseProduct(product), related: related.map(parseProduct) });
});

// Admin: create product
router.post('/', authMiddleware, (req, res) => {
  const { category_id, name, subtitle, description, price, original_price, size_info,
          is_inquiry_only, stock, featured, images, tags, sort_order } = req.body;

  if (!name) return res.status(400).json({ error: '商品名称不能为空' });

  const result = getDb().prepare(`
    INSERT INTO products (category_id, name, subtitle, description, price, original_price,
      size_info, is_inquiry_only, stock, featured, images, tags, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(category_id, name, subtitle, description, price, original_price, size_info,
         is_inquiry_only ? 1 : 0, stock || 1, featured ? 1 : 0,
         JSON.stringify(images || []), JSON.stringify(tags || []), sort_order || 0);

  const product = getDb().prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(parseProduct(product));
});

// Admin: update product
router.put('/:id', authMiddleware, (req, res) => {
  const { category_id, name, subtitle, description, price, original_price, size_info,
          is_inquiry_only, stock, featured, images, tags, sort_order, is_active } = req.body;

  const existing = getDb().prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: '商品不存在' });

  getDb().prepare(`
    UPDATE products SET
      category_id = ?, name = ?, subtitle = ?, description = ?, price = ?,
      original_price = ?, size_info = ?, is_inquiry_only = ?, stock = ?,
      featured = ?, images = ?, tags = ?, sort_order = ?, is_active = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    category_id ?? existing.category_id,
    name ?? existing.name,
    subtitle ?? existing.subtitle,
    description ?? existing.description,
    price !== undefined ? price : existing.price,
    original_price !== undefined ? original_price : existing.original_price,
    size_info ?? existing.size_info,
    is_inquiry_only !== undefined ? (is_inquiry_only ? 1 : 0) : existing.is_inquiry_only,
    stock ?? existing.stock,
    featured !== undefined ? (featured ? 1 : 0) : existing.featured,
    images ? JSON.stringify(images) : existing.images,
    tags ? JSON.stringify(tags) : existing.tags,
    sort_order ?? existing.sort_order,
    is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
    req.params.id
  );

  const updated = getDb().prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(parseProduct(updated));
});

// Admin: delete product
router.delete('/:id', authMiddleware, (req, res) => {
  getDb().prepare('UPDATE products SET is_active = 0 WHERE id = ?').run(req.params.id);
  res.json({ message: '商品已下架' });
});

function parseProduct(p) {
  return {
    ...p,
    images: JSON.parse(p.images || '[]'),
    tags: JSON.parse(p.tags || '[]'),
    is_inquiry_only: Boolean(p.is_inquiry_only),
    featured: Boolean(p.featured),
    is_active: Boolean(p.is_active),
  };
}

module.exports = router;
