const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'huanxi_tianzhu_secret';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未授权，请先登录' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token 已过期，请重新登录' });
  }
}

module.exports = { authMiddleware, JWT_SECRET };
