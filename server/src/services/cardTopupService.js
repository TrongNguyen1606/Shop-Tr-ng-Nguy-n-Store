const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const CardTransaction = require('../models/CardTransaction');

const PARTNER_ID = process.env.CARD_PARTNER_ID;
const PARTNER_KEY = process.env.CARD_PARTNER_KEY;
const API_URL = process.env.CARD_API_URL;
const CALLBACK_URL = process.env.CARD_CALLBACK_URL;

// NOTE: mỗi nhà cung cấp (Card2K/Thesieutoc/Doithe1s...) có công thức ký khác nhau.
// Đọc kỹ docs API thật của NCC bạn dùng và chỉnh lại chuỗi ghép + thuật toán ở đây.
function buildSignature({ telco, code, serial, amount, request_id }) {
  const raw = `${telco}${code || ''}${serial}${amount}${request_id}${PARTNER_ID}`;
  return crypto.createHmac('sha512', PARTNER_KEY).update(raw).digest('hex');
}

async function chargeCard({ telco, code, serial, amount, userId }) {
  const requestId = uuidv4();

  const payload = {
    telco, code, serial, amount,
    request_id: requestId,
    partner_id: PARTNER_ID,
    command: 'charging',
    callback_url: CALLBACK_URL,
  };
  payload.sign = buildSignature(payload);

  const tx = await CardTransaction.create({
    user: userId,
    requestId,
    telco,
    serial,
    code,
    declaredAmount: amount,
    status: 'pending',
  });

  try {
    const { data } = await axios.post(API_URL, payload, { timeout: 15000 });
    if (data.status === 3 || data.status === 4) {
      tx.status = data.status === 3 ? 'wrong_amount' : 'failed';
      tx.providerMessage = data.message;
      await tx.save();
    }
    return { requestId, initialStatus: data.status, message: data.message };
  } catch (err) {
    tx.status = 'failed';
    tx.providerMessage = 'Không kết nối được nhà cung cấp';
    await tx.save();
    throw err;
  }
}

module.exports = { chargeCard, buildSignature };
