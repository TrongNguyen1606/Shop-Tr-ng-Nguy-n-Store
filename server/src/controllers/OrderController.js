const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { validateCoupon } = require('../services/couponService');
const { notifyNewOrder } = require('../services/discordWebhook');

exports.checkout = async (req, res) => {
  const { productId, gameId, robloxVerified, noteForAdmin, couponCode, payNow } = req.body;
  if (!gameId) return res.status(400).json({ error: 'Vui lòng nhập Game ID' });

  const product = await Product.findById(productId);
  if (!product || !product.isActive) return res.status(404).json({ error: 'Sản phẩm không tồn tại' });

  let totalAmount = Math.round(product.price * (1 - product.discountPercent / 100));
  let appliedCoupon = null;

  if (couponCode) {
    try {
      const { coupon, discount } = await validateCoupon(couponCode, totalAmount);
      totalAmount -= Math.round(discount);
      appliedCoupon = coupon;
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // payNow=false => chỉ thêm vào giỏ hàng, không trừ tiền / tạo đơn ngay
  if (!payNow) {
    return res.json({ message: 'Đã thêm vào giỏ hàng', item: { productId, gameId, totalAmount, couponCode } });
  }

  const user = await User.findById(req.user._id);
  if (user.balance < totalAmount) {
    return res.status(400).json({ error: 'Số dư không đủ, vui lòng nạp thêm' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    user.balance -= totalAmount;
    await user.save({ session });

    const [order] = await Order.create([{
      user: user._id,
      items: [{ product: product._id, quantity: 1, priceAtPurchase: totalAmount }],
      gameId,
      robloxVerified: robloxVerified || { verified: false },
      noteForAdmin,
      couponCode: couponCode || null,
      totalAmount,
      status: 'pending',
    }], { session });

    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save({ session });
    }

    await Transaction.create([{
      user: user._id,
      type: 'purchase',
      amount: -totalAmount,
      balanceAfter: user.balance,
      reference: order._id.toString(),
      note: `Mua ${product.name}`,
    }], { session });

    await session.commitTransaction();
    notifyNewOrder(order, user);
    res.json({ order });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: 'Đặt hàng thất bại, thử lại' });
  } finally {
    session.endSession();
  }
};

exports.myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// Admin
exports.getAll = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const orders = await Order.find(filter)
    .populate('user', 'email discord')
    .populate('handledBy', 'email')
    .sort({ createdAt: -1 })
    .limit(200);
  res.json(orders);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'processing', 'completed', 'failed_cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Trạng thái không hợp lệ' });

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status, handledBy: req.user._id },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
  res.json(order);
};
