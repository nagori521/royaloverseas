import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userEmail: String,
    action: {
      type: String,
      enum: ['login', 'logout', 'create', 'update', 'delete', 'view', 'export', 'permission_change', 'login_failed', 'logout_failed'],
      required: true,
    },
    resource: {
      type: String,
      enum: ['user', 'product', 'gallery', 'inquiry', 'customer', 'settings', 'role', 'department', 'notification'],
    },
    resourceId: mongoose.Schema.Types.ObjectId,
    details: String,
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
    },
    ipAddress: String,
    userAgent: String,
    statusCode: Number,
    affectedRecords: Number,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
);

// Compound index for efficient queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, timestamp: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
