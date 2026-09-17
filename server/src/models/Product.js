const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, enum: ['gamepass', 'currency', 'boost', 'other'], default: 'other' },
  platform: { type: String, enum: ['roblox', 'ugphone'], required: true },
  image: String,
  description: String,
  price: { type: Number, required: true },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.virtual('finalPrice').get(function () {
  return Math.round(this.price * (1 - this.discountPercent / 100));
});
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
