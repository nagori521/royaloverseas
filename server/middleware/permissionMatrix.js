// Role-based permission matrix
export const ROLE_PERMISSIONS = {
  super_admin: {
    role: 'super_admin',
    displayName: 'Super Administrator',
    permissions: [
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
    description: 'Full system access',
  },
  manager: {
    role: 'manager',
    displayName: 'Manager',
    permissions: [
      'dashboard',
      'products_view',
      'products_create',
      'products_edit',
      'gallery_view',
      'gallery_create',
      'gallery_edit',
      'inquiries_view',
      'inquiries_respond',
      'customers_view',
      'notifications_manage',
    ],
    description: 'Manage products, gallery, inquiries, and customers',
  },
  staff: {
    role: 'staff',
    displayName: 'Staff',
    permissions: ['products_view', 'products_create', 'inquiries_view', 'inquiries_respond'],
    description: 'Limited access to assigned modules',
  },
};

// Department-based access
export const DEPARTMENT_RESOURCES = {
  sales: {
    displayName: 'Sales Department',
    permissions: ['inquiries_view', 'inquiries_respond', 'customers_view'],
  },
  export: {
    displayName: 'Export Department',
    permissions: [
      'products_view',
      'products_create',
      'products_edit',
      'customers_view',
      'customers_export',
    ],
  },
  inventory: {
    displayName: 'Inventory Department',
    permissions: [
      'products_view',
      'products_create',
      'products_edit',
      'products_delete',
      'gallery_view',
      'gallery_create',
      'gallery_edit',
    ],
  },
  management: {
    displayName: 'Management',
    permissions: [
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
      'audit_logs_view',
      'notifications_manage',
    ],
  },
};

// Sidebar items configuration
export const SIDEBAR_ITEMS = {
  dashboard: {
    label: 'Dashboard',
    path: '/admin',
    icon: 'BarChart3',
    permissions: ['dashboard'],
    roles: ['super_admin', 'manager'],
  },
  products: {
    label: 'Products',
    path: '/admin/products',
    icon: 'Package',
    permissions: ['products_view'],
    roles: ['super_admin', 'manager', 'staff'],
  },
  gallery: {
    label: 'Gallery',
    path: '/admin/gallery',
    icon: 'Image',
    permissions: ['gallery_view'],
    roles: ['super_admin', 'manager'],
  },
  inquiries: {
    label: 'Inquiries',
    path: '/admin/inquiries',
    icon: 'MessageSquare',
    permissions: ['inquiries_view'],
    roles: ['super_admin', 'manager', 'staff'],
  },
  customers: {
    label: 'Customers',
    path: '/admin/customers',
    icon: 'Users',
    permissions: ['customers_view'],
    roles: ['super_admin', 'manager'],
  },
  users: {
    label: 'User Management',
    path: '/admin/users',
    icon: 'Users2',
    permissions: ['users_manage'],
    roles: ['super_admin'],
  },
  auditLogs: {
    label: 'Audit Logs',
    path: '/admin/audit-logs',
    icon: 'HistoryIcon',
    permissions: ['audit_logs_view'],
    roles: ['super_admin'],
  },
  notifications: {
    label: 'Notifications',
    path: '/admin/notifications',
    icon: 'Bell',
    permissions: ['notifications_manage'],
    roles: ['super_admin', 'manager'],
  },
  settings: {
    label: 'Settings',
    path: '/admin/settings',
    icon: 'Settings',
    permissions: ['settings_view'],
    roles: ['super_admin'],
  },
};

export function hasPermission(user, permission) {
  if (!user) return false;
  if (user.role === 'super_admin') return true;
  return user.permissions.includes(permission);
}

export function hasRole(user, role) {
  if (!user) return false;
  return user.role === role;
}

export function canAccessResource(user, resource) {
  const resourcePermissionMap = {
    products: 'products_view',
    gallery: 'gallery_view',
    inquiries: 'inquiries_view',
    customers: 'customers_view',
    settings: 'settings_view',
    users: 'users_manage',
    audit_logs: 'audit_logs_view',
    notifications: 'notifications_manage',
  };

  return hasPermission(user, resourcePermissionMap[resource]);
}

export function getFilteredSidebarItems(user) {
  if (!user) return [];

  return Object.entries(SIDEBAR_ITEMS)
    .filter(([, item]) => {
      // Check role
      if (!item.roles.includes(user.role)) return false;

      // Check permissions
      if (item.permissions && item.permissions.length > 0) {
        return item.permissions.some((perm) => hasPermission(user, perm));
      }

      return true;
    })
    .map(([key, item]) => ({ id: key, ...item }));
}
