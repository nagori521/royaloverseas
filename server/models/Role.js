import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a role name'],
      unique: true,
      enum: ['super_admin', 'manager', 'staff'],
    },
    displayName: String,
    description: String,
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
    },
    priority: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Role', roleSchema);
