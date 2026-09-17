const mongoose = require('mongoose');
const { Schema } = mongoose;

const cardTransactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  requestId: { type: String, unique: true, required: true },
  provider: { type: String, default: 'card2k' },
  telco: { type: String, enum: ['VIETTEL', 'MOBIFONE', 'VINAPHONE', 'ZING', 'GATE', 'VNMOBI'], required: true },
  serial: { type: String, required: true },
  code: { type: String, required: true, select: false },
  declaredAmount: { type: Number, required: true },
  actualAmount: Number,
  status: { type: String, enum: ['pending', 'success', 'wrong_amount', 'failed'], default: 'pending' },
  providerMessage: String,
  rawCallback: Object,
}, { timestamps: true });

module.exports = mongoose.model('CardTransaction', cardTransactionSchema);
