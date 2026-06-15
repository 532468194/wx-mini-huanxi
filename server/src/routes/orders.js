const express = require('express');
const { getDb } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

function genOrderNo() {
  const now = new Date();
  const ts = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0');
  return 'HX' + ts + Math.floor(Math.random() * 9000 + 1000);
}

// Public: create order
router.post('/', (req, res) => {
  const { product_id, quantity = 1, customer_name, customer_phone, customer_wechat,
          customer_address, message } = req.body;

  if (!product_id || !customer_phone) {
    return res.status(400).json({ error: '商品ID和联系电话为必填项' });
  }

  const product = getDb().prepare('SELECT * FROM products WHERE id = ? AND is_active = 1').get(product_id);
  if (!product) return res.status(404).json({ error: '商品不存在或已下架' });

  if (!product.is_inquiry_only && product.stock < quantity) {
    return res.status(400).json({ error: '库存不足' });
  }

  const images = JSON.parse(product.images || '[]');
  const order_no = genOrderNo();
  const total_price = product.price ? product.price * quantity : null;

  const result = getDb().prepare(`
    INSERT INTO orders (order_no, product_id, product_name, product_image, price, quantity,
      total_price, customer_name, customer_phone, customer_wechat, customer_address, message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(order_no, product_id, product.name, images[0] || '',
         product.price, quantity, total_price,
         customer_name, customer_phone, customer_wechat, customer_address, message);

  // Reduce stock for purchasable items
  if (!product.is_inquiry_only) {
    getDb().prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(quantity, product_id);
  }

  // Record analytics event
  try {
    getDb().prepare('INSERT INTO analytics (event_type, product_id, ip) VALUES (?, ?, ?)').run(
      'order', product_id, req.ip
    );
  } catch {}

  res.status(201).json({
    order_no,
    message: product.is_inquiry_only
      ? '询价申请已提交，我们将在24小时内通过微信联系您'
      : '下单成功，请等待商家确认后联系付款',
  });
});

// Admin: list orders
router.get('/', authMiddleware, (req, res) => {
  const { status, page = 1, limit = 20, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let where = 'WHERE 1=1';
  const params = [];

  if (status) { where += ' AND status = ?'; params.push(status); }
  if (search) {
    where += ' AND (order_no LIKE ? OR product_name LIKE ? OR customer_phone LIKE ? OR customer_name LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  const { total } = getDb().prepare(`SELECT COUNT(*) as total FROM orders ${where}`).get(...params);
  const orders = getDb().prepare(`
    SELECT * FROM orders ${where}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, parseInt(limit), offset);

  res.json({ data: orders, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// Admin: get single order
router.get('/:id', authMiddleware, (req, res) => {
  const order = getDb().prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: '订单不存在' });
  res.json(order);
});

// Admin: update order status
router.put('/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'paid', 'shipped', 'completed', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ error: '无效的状态' });

  getDb().prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, req.params.id);
  res.json({ message: '订单状态已更新' });
});

module.exports = router;
