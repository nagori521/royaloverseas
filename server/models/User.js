import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['super_admin', 'manager', 'staff'],
      default: 'staff',
    },
    permissions: {
      type: [String],
      enum: [
        'dashboard',
        'products_view',
        'products_create',
        'products_edit',
        'products_delete',
        'gallery_view',
        'gallery_create',
        'gallery_edit',
        'gallery_delete',
        'inquiries_view',
        'inquiries_respond',
        'customers_view',
        'customers_export',
        'settings_view',
        'settings_edit',
        'users_manage',
        'audit_logs_view',
        'notifications_manage',
      ],
      default: [],
    },
    departments: {
      type: [String],
      enum: ['sales', 'export', 'inventory', 'management'],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    loginLockedUntil: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    auditLog: [
      {
        action: String,
        details: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        ipAddress: String,
        userAgent: String,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to check if account is locked
userSchema.methods.isAccountLocked = function () {
  return this.loginLockedUntil && new Date() < new Date(this.loginLockedUntil);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = async function () {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.loginLockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  }
  return this.save();
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.loginLockedUntil = null;
  this.lastLogin = new Date();
  return this.save();
};

// Method to add audit log entry
userSchema.methods.addAuditLog = async function (action, details, ipAddress, userAgent) {
  this.auditLog.push({
    action,
    details,
    timestamp: new Date(),
    ipAddress,
    userAgent,
  });
  this.lastActivity = new Date();
  return this.save();
};

// Method to check permission
userSchema.methods.hasPermission = function (permission) {
  if (this.role === 'super_admin') return true;
  return this.permissions.includes(permission);
};

// Method to get user data for token
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.auditLog;
  delete obj.__v;
  return obj;
};

export default mongoose.model('User', userSchema);
