const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function verifyToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: 'Tài khoản không tồn tại' });
    if (user.isLocked) return res.status(403).json({ error: 'Tài khoản đã bị khóa' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
}

// Không chặn nếu chưa login, nhưng gắn req.user nếu có token hợp lệ
async function attachUserOptional(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id);
  } catch {
    // ignore invalid token for optional routes
  }
  next();
}

module.exports = { verifyToken, attachUserOptional };
