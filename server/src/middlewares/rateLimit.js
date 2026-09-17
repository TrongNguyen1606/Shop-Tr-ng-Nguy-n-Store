const rateLimit = require('express-rate-limit');

const verifyGameIdLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Bạn thao tác quá nhanh, thử lại sau ít phút.' },
});

const cardChargeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: { error: 'Bạn nạp thẻ quá nhanh, vui lòng chờ.' },
});

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { error: 'Quá nhiều yêu cầu đăng nhập/đăng ký, thử lại sau.' },
});

const checkoutLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: { error: 'Quá nhiều yêu cầu đặt hàng, vui lòng chờ.' },
});

module.exports = { verifyGameIdLimiter, cardChargeLimiter, authLimiter, checkoutLimiter };
