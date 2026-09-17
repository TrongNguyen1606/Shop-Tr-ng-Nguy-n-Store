const Order = require('../models/Order');
const CardTransaction = require('../models/CardTransaction');
const Coupon = require('../models/Coupon');

exports.getOrderStats = async (req, res) => {
  const { from, to, status } = req.query;
  const match = {};
  if (from || to) match.createdAt = { ...(from && { $gte: new Date(from) }), ...(to && { $lte: new Date(to) }) };
  if (status) match.status = status;

  const [summary, list] = await Promise.all([
    Order.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
    ]),
    Order.find(match).populate('user', 'email discord').populate('handledBy', 'email').sort({ createdAt: -1 }).limit(100),
  ]);

  res.json({ summary, list });
};

exports.getCardReconciliation = async (req, res) => {
  const { from, to } = req.query;
  const match = {};
  if (from || to) match.createdAt = { ...(from && { $gte: new Date(from) }), ...(to && { $lte: new Date(to) }) };

  const [stats, successList] = await Promise.all([
    CardTransaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          declaredTotal: { $sum: '$declaredAmount' },
          actualTotal: { $sum: '$actualAmount' },
        },
      },
    ]),
    CardTransaction.find({ ...match, status: 'success' })
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .limit(200),
  ]);

  res.json({ stats, successList });
};

// Coupon management (admin/owner)
exports.createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
};

exports.listCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
};
