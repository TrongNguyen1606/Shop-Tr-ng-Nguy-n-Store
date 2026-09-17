const CardTransaction = require('../models/CardTransaction');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { chargeCard, buildSignature } = require('../services/cardTopupService');
const { notifyDepositSuccess } = require('../services/discordWebhook');

exports.submitCard = async (req, res) => {
  const { telco, code, serial, amount } = req.body;
  if (!telco || !code || !serial || !amount) {
    return res.status(400).json({ error: 'Thiếu thông tin thẻ' });
  }
  try {
    const result = await chargeCard({ telco, code, serial, amount, userId: req.user._id });
    res.json({
      message: 'Thẻ đang được xử lý, vui lòng chờ trong giây lát',
      requestId: result.requestId,
    });
  } catch {
    res.status(502).json({ error: 'Hệ thống nạp thẻ đang bận, thử lại sau' });
  }
};

exports.checkStatus = async (req, res) => {
  const tx = await CardTransaction.findOne({
    requestId: req.params.requestId,
    user: req.user._id,
  });
  if (!tx) return res.status(404).json({ error: 'Không tìm thấy giao dịch' });
  res.json({ status: tx.status, actualAmount: tx.actualAmount, message: tx.providerMessage });
};

// Endpoint public — nhà cung cấp thẻ gọi vào, không qua verifyToken
exports.handleCallback = async (req, res) => {
  const { request_id, status, amount, sign, message } = req.body;
  if (!request_id) return res.status(400).json({ error: 'Missing request_id' });

  const tx = await CardTransaction.findOne({ requestId: request_id });
  if (!tx) return res.status(404).json({ error: 'Transaction not found' });
  if (tx.status === 'success') return res.json({ received: true });

  const expectedSign = buildSignature({ telco: tx.telco, serial: tx.serial, amount, request_id });
  if (sign !== expectedSign) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  tx.rawCallback = req.body;
  tx.providerMessage = message;

  if (Number(status) === 1) {
    tx.status = 'success';
    tx.actualAmount = amount;
    await tx.save();

    const user = await User.findById(tx.user);
    user.balance += amount;
    user.totalDeposited += amount;
    await user.save();

    await Transaction.create({
      user: user._id,
      type: 'deposit',
      amount,
      balanceAfter: user.balance,
      reference: tx.requestId,
      note: `Nạp thẻ ${tx.telco} - serial ${tx.serial}`,
    });

    notifyDepositSuccess(user, amount);
  } else {
    tx.status = Number(status) === 2 ? 'wrong_amount' : 'failed';
    await tx.save();
  }

  res.json({ received: true });
};
