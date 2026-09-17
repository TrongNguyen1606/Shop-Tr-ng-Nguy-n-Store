const Transaction = require('../models/Transaction');
const AuditLog = require('../models/AuditLog');
const { notifyBalanceAdjust } = require('../services/discordWebhook');
const User = require('../models/User');

exports.getMyTransactions = async (req, res) => {
  const list = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(200);
  res.json(list);
};

// Owner only
exports.adjustBalance = async (req, res) => {
  const { amount, note } = req.body;
  if (!amount || isNaN(amount)) return res.status(400).json({ error: 'Số tiền không hợp lệ' });

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

  user.balance += Number(amount);
  await user.save();

  await Transaction.create({
    user: user._id,
    type: 'admin_adjust',
    amount: Number(amount),
    balanceAfter: user.balance,
    performedBy: req.user._id,
    note,
  });

  await AuditLog.create({
    actor: req.user._id,
    action: 'adjust_balance',
    targetUser: user._id,
    meta: { amount, note },
  });

  notifyBalanceAdjust(user, Number(amount), note, req.user);
  res.json({ balance: user.balance });
};

// Owner only
exports.toggleLock = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
  if (user.role === 'owner') return res.status(403).json({ error: 'Không thể khóa tài khoản Owner' });

  user.isLocked = !user.isLocked;
  await user.save();

  await AuditLog.create({
    actor: req.user._id,
    action: user.isLocked ? 'lock_user' : 'unlock_user',
    targetUser: user._id,
  });

  res.json({ isLocked: user.isLocked });
};

// Owner only — không bao giờ nhận role trực tiếp từ payload gốc, chỉ set field đã whitelist
exports.updateRole = async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Chỉ có thể gán quyền user hoặc admin qua API' });
  }
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
  if (user.role === 'owner') return res.status(403).json({ error: 'Không thể thay đổi quyền Owner' });

  user.role = role;
  await user.save();

  await AuditLog.create({
    actor: req.user._id,
    action: 'update_role',
    targetUser: user._id,
    meta: { newRole: role },
  });

  res.json({ role: user.role });
};

exports.list = async (req, res) => {
  const users = await User.find().select('email role balance totalDeposited isLocked discord createdAt').sort({ createdAt: -1 });
  res.json(users);
};

// Public leaderboard
exports.topDeposit = async (req, res) => {
  const top = await User.find({ totalDeposited: { $gt: 0 } })
    .select('email totalDeposited discord')
    .sort({ totalDeposited: -1 })
    .limit(10);
  res.json(top);
};
