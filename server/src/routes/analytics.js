const express = require('express');
const { getDb } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Dashboard overview - admin only
router.get('/overview', authMiddleware, (req, res) => {
  const db = getDb();

  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Today's stats
  const todayViews = db.prepare(
    "SELECT COUNT(*) as c FROM analytics WHERE event_type='page_view' AND date(created_at)=?"
  ).get(today).c;

  const todayOrders = db.prepare(
    "SELECT COUNT(*) as c FROM orders WHERE date(created_at)=?"
  ).get(today).c;

  // Total stats
  const totalViews = db.prepare("SELECT COUNT(*) as c FROM analytics WHERE event_type='page_view'").get().c;
  const totalOrders = db.prepare("SELECT COUNT(*) as c FROM orders").get().c;
  const totalRevenue = db.prepare(
    "SELECT COALESCE(SUM(total_price), 0) as s FROM orders WHERE status NOT IN ('cancelled') AND total_price IS NOT NULL"
  ).get().s;
  const totalProducts = db.prepare("SELECT COUNT(*) as c FROM products WHERE is_active=1").get().c;

  // Orders by status
  const ordersByStatus = db.prepare("SELECT status, COUNT(*) as count FROM orders GROUP BY status").all();

  // Recent 7 days traffic
  const dailyTraffic = db.prepare(`
    SELECT date(created_at) as date, COUNT(*) as views
    FROM analytics WHERE event_type='page_view' AND date(created_at) >= ?
    GROUP BY date(created_at) ORDER BY date ASC
  `).all(weekAgo);

  // Recent 7 days orders
  const dailyOrders = db.prepare(`
    SELECT date(created_at) as date, COUNT(*) as orders,
           COALESCE(SUM(total_price), 0) as revenue
    FROM orders WHERE date(created_at) >= ?
    GROUP BY date(created_at) ORDER BY date ASC
  `).all(weekAgo);

  // Top products by views
  const topProducts = db.prepare(`
    SELECT p.id, p.name, p.price, p.is_inquiry_only,
           COUNT(a.id) as views
    FROM analytics a
    JOIN products p ON a.product_id = p.id
    WHERE a.event_type = 'product_view' AND a.created_at >= ?
    GROUP BY a.product_id ORDER BY views DESC LIMIT 5
  `).all(monthAgo);

  res.json({
    today: { views: todayViews, orders: todayOrders },
    total: { views: totalViews, orders: totalOrders, revenue: totalRevenue, products: totalProducts },
    ordersByStatus,
    dailyTraffic,
    dailyOrders,
    topProducts,
  });
});

// Traffic details
router.get('/traffic', authMiddleware, (req, res) => {
  const { days = 30 } = req.query;
  const daysAgo = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const daily = getDb().prepare(`
    SELECT date(created_at) as date, COUNT(*) as views
    FROM analytics WHERE event_type='page_view' AND date(created_at) >= ?
    GROUP BY date(created_at) ORDER BY date ASC
  `).all(daysAgo);

  const pages = getDb().prepare(`
    SELECT page, COUNT(*) as views
    FROM analytics WHERE event_type='page_view' AND date(created_at) >= ?
    GROUP BY page ORDER BY views DESC LIMIT 10
  `).all(daysAgo);

  res.json({ daily, pages });
});

// Product analytics
router.get('/products', authMiddleware, (req, res) => {
  const { days = 30 } = req.query;
  const daysAgo = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const productViews = getDb().prepare(`
    SELECT p.id, p.name, p.price, p.is_inquiry_only, p.category_id,
           COUNT(a.id) as views
    FROM analytics a
    JOIN products p ON a.product_id = p.id
    WHERE a.event_type = 'product_view' AND date(a.created_at) >= ?
    GROUP BY a.product_id ORDER BY views DESC LIMIT 20
  `).all(daysAgo);

  res.json(productViews);
});

module.exports = router;
