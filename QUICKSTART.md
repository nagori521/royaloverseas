# Royal Overseas Admin Security - Quick Start Guide

## 1. Setup (5 minutes)

### Environment Configuration
```bash
# Copy and customize .env
cp .env.example .env

# Edit .env with your values
# Key settings:
ADMIN_ROUTE=ro-panel-2026
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@royaloverseas.com
ADMIN_PASSWORD=YourSecurePassword123
```

### Database Seeding
```bash
# Install dependencies (if not done)
npm install

# Seed default roles and admin user
npm run seed
```

Expected output:
```
Connected to MongoDB
✓ Created role: super_admin
✓ Created role: manager
✓ Created role: staff
✓ Created super admin user: admin@royaloverseas.com
✓ Database seeding completed successfully!
```

## 2. Run (Development)

### Terminal 1: Backend
```bash
npm run dev:server
```

### Terminal 2: Frontend
```bash
npm run dev
```

## 3. Access Admin Panel

1. Open browser: `http://localhost:5173/ro-panel-2026`
2. Login with:
   - Email: `admin@royaloverseas.com`
   - Password: (from your `ADMIN_PASSWORD` env var)
3. You'll see the admin dashboard with full access

## 4. Create New Users

### Via UI (Admin Panel)
1. Navigate to "User Management"
2. Click "Add User"
3. Fill form:
   - Name
   - Email
   - Password
   - Role (Staff, Manager, Super Admin)
4. Click "Create User"

### Via API (curl example)
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Manager",
    "email": "john@royaloverseas.com",
    "password": "SecurePass123",
    "role": "manager",
    "permissions": ["dashboard", "products_view", "gallery_view"],
    "status": "active"
  }'
```

## 5. Key Features Demo

### View Audit Logs
1. Click "Audit Logs" in sidebar
2. Filter by:
   - Action (login, create, update, delete)
   - Resource (user, product, etc.)
   - Date range
3. See IP addresses and failed logins

### Manage Users
1. Click "User Management"
2. See all users in a table
3. Actions per user:
   - Edit role/permissions
   - Disable (lock icon)
   - Delete (trash icon)

### View Your Profile
1. Click user avatar or "Profile"
2. View account info
3. Change password
4. See your permissions and departments

### Dynamic Sidebar
- Each role sees different menu items
- Staff: Products, Inquiries only
- Manager: Plus Gallery, Customers
- Super Admin: Everything

## 6. Security Features in Action

### Login Protection
1. Try wrong password 5 times
2. Account locks for 15 minutes
3. See login attempt count

### Session Timeout
1. Login successfully
2. Wait 30 minutes without activity
3. Redirected to login page

### Role-Based Access
1. Login as Staff user
2. "Users" and "Audit Logs" items hidden
3. Try accessing `/ro-panel-2026/users` directly
4. Access denied message appears

### Audit Trail
1. Create a new user
2. Go to "Audit Logs"
3. See your action logged:
   - Timestamp
   - Action type (create)
   - Resource (user)
   - Your email
   - IP address
   - Status (success)

## 7. Environment Variables Explained

```env
# Admin route (hidden from public)
ADMIN_ROUTE=ro-panel-2026

# JWT token expiry
JWT_EXPIRY=7d

# Session inactivity timeout (seconds)
SESSION_TIMEOUT=1800

# JWT signing secret (use strong random string)
JWT_SECRET=your-very-secure-random-string-here

# Default admin credentials
ADMIN_EMAIL=admin@royaloverseas.com
ADMIN_PASSWORD=InitialSecurePassword

# Database
MONGO_URI=mongodb://127.0.0.1:27017/royaloverseas

# Server & Client URLs
PORT=5000
CLIENT_URL=http://127.0.0.1:5173
VITE_API_URL=http://127.0.0.1:5000
```

## 8. Role Permissions Summary

### Super Admin ✓
- All permissions
- User management
- Role assignment
- System settings
- Audit logs

### Manager ✓
- Dashboard
- Products (view, create, edit)
- Gallery (view, create, edit)
- Inquiries (view, respond)
- Customers (view)
- Notifications

### Staff ✓
- Products (view, create)
- Inquiries (view, respond)
- Limited to assigned modules

## 9. Departments (Optional)

Assign staff to departments:
- **Sales**: Access inquiries, customers
- **Export**: Access products, customers, shipping
- **Inventory**: Access products, gallery
- **Management**: Full access

Via API:
```bash
curl -X POST http://localhost:5000/api/users/:userId/assign-departments \
  -H "Authorization: Bearer TOKEN" \
  -d '{"departments": ["sales", "inventory"]}'
```

## 10. Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Run `npm run seed` to create admin user |
| Routes 404 | Check ADMIN_ROUTE matches between .env and code |
| Permission denied | Verify user has correct role assigned |
| Database error | Check MongoDB running and MONGO_URI correct |
| JWT errors | Verify JWT_SECRET is set and consistent |

## 11. Common Tasks

### Change Admin Password
1. Login as admin
2. Click Profile → Change Password
3. Enter current and new password
4. Save

### Disable a User
1. Go to User Management
2. Find user row
3. Click lock icon
4. User can't login (status: inactive)

### View Failed Logins
1. Go to Audit Logs
2. Filter by Action: "login_failed"
3. See IP addresses and timestamps

### Export Audit Logs (Manual)
1. Go to Audit Logs
2. Note the data displayed
3. Copy/paste to spreadsheet or use API directly

## 12. API Quick Reference

### Login
```bash
POST /api/auth/login
{
  "email": "admin@royaloverseas.com",
  "password": "password123"
}
# Returns: { token: "jwt_token", user: {...} }
```

### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer jwt_token
```

### List Users
```bash
GET /api/users
Authorization: Bearer jwt_token
```

### View Audit Logs
```bash
GET /api/audit-logs?page=1&limit=50&action=login
Authorization: Bearer jwt_token
```

## 13. Next Steps

1. **Customize**: Modify roles/permissions for your needs
2. **Deploy**: Set up production .env
3. **2FA**: Enable two-factor authentication (structure ready)
4. **Backups**: Configure MongoDB backup strategy
5. **Monitoring**: Set up activity alerts
6. **Training**: Train team on new security practices

---

**Ready to use!** Your admin panel is now production-grade secure. 🔒

For detailed documentation, see:
- `SECURITY.md` - Comprehensive security guide
- `IMPLEMENTATION.md` - Full implementation details
