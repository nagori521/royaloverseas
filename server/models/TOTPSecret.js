import mongoose from 'mongoose';

const totpSecretSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    secret: {
      type: String,
      // Will store encrypted TOTP secret when 2FA is enabled
    },
    backupCodes: [
      {
        code: String,
        used: Boolean,
        usedAt: Date,
      },
    ],
    isEnabled: {
      type: Boolean,
      default: false,
    },
    enabledAt: Date,
    disabledAt: Date,
    recoveryEmail: String,
    lastVerified: Date,
    verificationAttempts: {
      type: Number,
      default: 0,
    },
    lastFailedAttempt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('TOTPSecret', totpSecretSchema);
