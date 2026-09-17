const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'purchase', 'admin_adjust', 'refund'], required: true },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  reference: String,
  performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  note: String,
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
