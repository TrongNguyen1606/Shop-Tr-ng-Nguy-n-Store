const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    priceAtPurchase: Number,
  }],
  gameId: { type: String, required: true },
  robloxVerified: {
    verified: { type: Boolean, default: false },
    displayName: String,
    avatarUrl: String,
  },
  noteForAdmin: String,
  couponCode: String,
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed_cancelled'],
    default: 'pending',
  },
  handledBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
