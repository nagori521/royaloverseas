import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'error', 'success', 'inquiry', 'system'],
      default: 'info',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    action: {
      type: {
        type: String, // 'link' or 'action'
      },
      url: String,
      label: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: mongoose.Schema.Types.Mixed,
    expiresAt: Date,
  },
  { timestamps: true }
);

// Auto-remove expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for user notifications
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

export default mongoose.model('Notification', notificationSchema);
