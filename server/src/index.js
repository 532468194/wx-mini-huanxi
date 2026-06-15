require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { initDb } = require('./database');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');
const bannerRoutes = require('./routes/banners');
const fileRoutes = require('./routes/files');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3001;

// Static files - serve existing product images
const STATIC_DIR = path.resolve(__dirname, '../../picture/huanxitianzhu/huanxitianzhu');
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

// Security & performance middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));
app.use(compression());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting for API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Serve static product images
app.use('/static', express.static(STATIC_DIR, {
  maxAge: '7d',
  etag: true,
}));
app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: '7d',
  etag: true,
}));

// Analytics middleware - record page views
app.use('/api/products', (req, res, next) => {
  if (req.method === 'GET' && req.params.id) {
    const { getDb } = require('./database');
    try {
      getDb().prepare(
        'INSERT INTO analytics (event_type, product_id, ip) VALUES (?, ?, ?)'
      ).run('product_view', req.params.id, req.ip);
    } catch {}
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Record page view
app.post('/api/track', (req, res) => {
  const { page, productId } = req.body;
  const { getDb } = require('./database');
  try {
    getDb().prepare(
      'INSERT INTO analytics (event_type, page, product_id, ip, user_agent) VALUES (?, ?, ?, ?, ?)'
    ).run('page_view', page || '/', productId || null, req.ip, req.headers['user-agent'] || '');
    res.json({ ok: true });
  } catch {
    res.json({ ok: false });
  }
});

// Initialize database and start server
initDb();
app.listen(PORT, () => {
  console.log(`\n🏮 欢喜天珠 API Server 启动成功`);
  console.log(`📡 运行端口: http://localhost:${PORT}`);
  console.log(`📁 静态图片目录: ${STATIC_DIR}`);
  console.log(`🔐 管理后台: http://localhost:5174\n`);
});
