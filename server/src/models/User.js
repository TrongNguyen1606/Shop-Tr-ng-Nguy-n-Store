const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  emailVerified: { type: Boolean, default: false },
  passwordHash: { type: String, select: false },
  googleId: { type: String, sparse: true },
  discord: {
    id: String,
    username: String,
    linkedAt: Date,
  },
  balance: { type: Number, default: 0 },
  totalDeposited: { type: Number, default: 0 },
  role: { type: String, enum: ['user', 'admin', 'owner'], default: 'user' },
  isLocked: { type: Boolean, default: false },
  otpCode: { type: String, select: false },
  otpExpiresAt: { type: Date, select: false },
  totpSecret: { type: String, select: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
