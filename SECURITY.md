# Royal Overseas Admin Security System

## Overview

Complete enterprise-grade admin panel with production security, role-based access control, and comprehensive audit logging.

## Features

### 1. Secure Admin Access
- **Configurable Route**: Admin panel accessible via environment variable `ADMIN_ROUTE` (default: `admin`)
- Example: `https://royaloverseas.com/ro-panel-2026`
- Static routes removed for production security
- robots.txt configured to exclude admin paths

### 2. Authentication & Session Management
- **JWT-based Authentication**: 7-day token expiry
- **Password Security**: bcrypt hashing with salt rounds
- **Login Attempt Limiting**: Max 5 failed attempts, 15-minute lockout
- **Session Timeout**: Auto-logout after 30 minutes of inactivity
- **Account Status Tracking**: Active/inactive user management
- **Last Login Tracking**: Audit trail for user access

### 3. Role-Based Access Control (RBAC)
Three predefined roles with granular permissions:

#### Super Admin
- Full system access
- User management
- Role assignment
- Permission configuration
- Department management
- Audit log access
- System settings

#### Manager
- Dashboard & analytics
- Products management (view, create, edit)
- Gallery management (view, create, edit)
- Inquiries management
- Customer management
- Notification management

#### Staff
- Limited to assigned permissions/departments
- Product viewing & creation
- Inquiry viewing & response
- No access to settings, users, or analytics

### 4. Permission System
Fine-grained permissions for each module:
- `dashboard` - View analytics and insights
- `products_view/create/edit/delete` - Product management
- `gallery_view/create/edit/delete` - Gallery management
- `inquiries_view/respond` - Inquiry management
- `customers_view/export` - Customer management
- `settings_view/edit` - System settings
- `users_manage` - User administration
- `audit_logs_view` - Audit log access
- `notifications_manage` - Notification management

### 5. Department System
Organize staff by departments with role-based access:
- **Sales**: Inquiries & customers access
- **Export**: Products, customers, shipping
- **Inventory**: Products & gallery management
- **Management**: Full access to assigned resources

### 6. Audit Logging
Comprehensive activity tracking:
- User login/logout events
- All create, update, delete operations
- Failed login attempts with IP tracking
- User agent logging
- Audit log retention and cleanup
- Query by action, resource, date range
- Statistics dashboard

### 7. User Management
Admin interface for managing users:
- Create/edit/delete users
- Assign roles and permissions
- Assign departments
- Enable/disable accounts
- Change user passwords
- Bulk status management

### 8. Security Features
- HTTP-only JWT tokens
- CORS protection
- Input validation and sanitization
- Rate limiting ready (structure in place)
- 2FA structure ready (not active by default)
- IP address tracking for all admin actions
- Account lockout on suspicious activity

## Installation & Setup

### 1. Environment Configuration

Create `.env` file with:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/royaloverseas
JWT_SECRET=your-secure-jwt-secret-here
JWT_EXPIRY=7d
SESSION_TIMEOUT=1800
ADMIN_ROUTE=ro-panel-2026
ADMIN_EMAIL=admin@royaloverseas.com
ADMIN_PASSWORD=SecurePassword123
CLIENT_URL=http://127.0.0.1:5173
VITE_API_URL=http://127.0.0.1:5000
VITE_ADMIN_ROUTE=ro-panel-2026
```

### 2. Database Seeding

Run the seed script to create default roles and super admin:
```bash
npm run seed
```

This creates:
- Default roles: super_admin, manager, staff
- Super admin user with all permissions
- Database indexes for performance

### 3. Development

Start the application:
```bash
npm run dev:server  # Backend with nodemon
npm run dev         # Frontend (in another terminal)
```

### 4. Production Build

```bash
npm run build       # Build frontend
npm run server      # Run production server
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (protected)
- `POST /api/auth/refresh-token` - Refresh JWT token (protected)
- `GET /api/auth/me` - Get current user (protected)

### User Management (Super Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `POST /api/users/:id/change-password` - Change user password
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/disable` - Disable user account
- `POST /api/users/:id/enable` - Enable user account
- `POST /api/users/:id/assign-role` - Assign role to user
- `POST /api/users/:id/assign-permissions` - Assign permissions
- `POST /api/users/:id/assign-departments` - Assign departments

### Audit Logs (Super Admin only)
- `GET /api/audit-logs` - Get audit logs (paginated)
- `GET /api/audit-logs/:id` - Get specific audit log
- `GET /api/audit-logs/user/:userId` - Get user's audit logs
- `GET /api/audit-logs/stats/overview` - Get audit statistics
- `DELETE /api/audit-logs/cleanup/old` - Delete old logs (>90 days)

### Notifications (All authenticated users)
- `GET /api/notifications` - Get user's notifications
- `POST /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/read/all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Frontend Components

### Guards
- `RoleGuard` - Conditional rendering by role
- `PermissionGuard` - Conditional rendering by permission
- `useUserRole` - Hook for permission checking

### Pages
- `AdminUserManagement` - User CRUD interface
- `AdminAuditLogs` - Activity log viewer
- `AdminProfile` - User profile & password change
- `AdminLayout` - Dynamic sidebar based on permissions

## Backend Middleware

### Authentication
- `protectRoute` - Verify JWT token and attach user
- `optionalAuth` - Optional authentication

### Authorization
- `requireRole` - Check specific roles
- `requireRoleAtLeast` - Hierarchical role checking
- `requirePermission` - Single permission check
- `requireAnyPermission` - Multiple permission OR logic
- `requireAllPermissions` - Multiple permission AND logic
- `requireDepartment` - Department-based access

### Audit
- `logAudit` - Automatic audit trail creation
- `auditMiddleware` - Log admin actions

## Database Models

### User Schema
```javascript
{
  name, email, passwordHash, role,
  permissions: [String],
  departments: [String],
  status: 'active' | 'inactive',
  loginAttempts, loginLockedUntil,
  lastLogin, lastPasswordChange,
  auditLog: [{ action, details, timestamp, ip, userAgent }],
  timestamps
}
```

### Role Schema
```javascript
{
  name: 'super_admin' | 'manager' | 'staff',
  displayName, description,
  permissions: [String],
  priority, status
}
```

### AuditLog Schema
```javascript
{
  userId, userEmail,
  action, resource, resourceId,
  details, status: 'success' | 'failure',
  statusCode, ipAddress, userAgent,
  affectedRecords, timestamp
}
```

### Notification Schema
```javascript
{
  userId, type, title, message,
  action: { type, url, label },
  isRead, metadata, expiresAt
}
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` to version control
2. **JWT Secret**: Use strong, random secret in production
3. **HTTPS**: Always use HTTPS in production
4. **Password Policy**: Enforce strong passwords (minimum 8 chars)
5. **Regular Audits**: Review audit logs regularly
6. **Backup**: Regular database backups
7. **Rate Limiting**: Implement rate limiting on login endpoint
8. **2FA**: Enable 2FA for additional security (structure ready)

## Troubleshooting

### Login Failing
1. Check MongoDB connection
2. Verify JWT_SECRET is set correctly
3. Run `npm run seed` to ensure admin user exists
4. Check login attempt limit (5 attempts, 15-minute lockout)

### Permissions Not Working
1. Verify user has correct role assigned
2. Check permission matrix definitions
3. Ensure user permissions array is populated
4. Check RoleGuard/PermissionGuard implementation

### Routes Not Found
1. Verify ADMIN_ROUTE environment variable
2. Check App.jsx route configuration
3. Verify route imports in AdminLayout
4. Check Vite config defines ADMIN_ROUTE

## Future Enhancements

1. **2FA Implementation**: SMS or email-based two-factor authentication
2. **Email Alerts**: Notify admins of suspicious activities
3. **API Rate Limiting**: Per-user rate limiting
4. **Advanced Audit**: More granular action logging
5. **Export Reports**: PDF/CSV audit log reports
6. **Dashboard Analytics**: Admin activity metrics
7. **Role Templates**: Customizable role templates
8. **Password Policy**: Configurable password requirements

## Support

For issues or questions:
1. Check the plan.md file for architecture details
2. Review .env.example for configuration
3. Check audit logs for error messages
4. Review error middleware responses

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Security Level**: Production Grade
