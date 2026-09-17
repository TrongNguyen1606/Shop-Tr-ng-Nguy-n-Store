const Coupon = require('../models/Coupon');

async function validateCoupon(code, orderAmount) {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new Error('Mã giảm giá không tồn tại');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error('Mã đã hết hạn');
  if (coupon.usedCount >= coupon.maxUses) throw new Error('Mã đã hết lượt sử dụng');

  const discount = coupon.discountType === 'percent'
    ? orderAmount * (coupon.value / 100)
    : coupon.value;

  return { coupon, discount: Math.min(discount, orderAmount) };
}

module.exports = { validateCoupon };
