const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditLogSchema = new Schema({
  actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetUser: { type: Schema.Types.ObjectId, ref: 'User' },
  meta: Object,
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
