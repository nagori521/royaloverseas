# Deployment Checklist - Royal Overseas Admin Security

## Pre-Deployment Tasks

### Environment Configuration
- [ ] Create production `.env` file
- [ ] Set `ADMIN_ROUTE` to custom value (e.g., `ro-panel-2026`)
- [ ] Generate strong `JWT_SECRET` (minimum 32 characters, random)
- [ ] Set production `MONGO_URI`
- [ ] Update `CLIENT_URL` to production domain
- [ ] Set `VITE_API_URL` to production API URL
- [ ] Set secure `ADMIN_PASSWORD` (minimum 12 characters)
- [ ] Verify `SESSION_TIMEOUT` setting (default 1800 seconds = 30 min)
- [ ] Confirm `JWT_EXPIRY` setting (default 7d)

### Database Preparation
- [ ] MongoDB instance running on production
- [ ] Database backup configured and tested
- [ ] Database connection string validated
- [ ] Indexes created (run `npm run seed`)
- [ ] Default roles and admin user created
- [ ] Database authentication enabled (user/password)
- [ ] Database connection pooling configured

### Security Setup
- [ ] HTTPS certificate installed and configured
- [ ] CORS configured for production domain only
- [ ] robots.txt deployed to public folder
- [ ] Security headers configured (Express middleware optional)
- [ ] Rate limiting configured on login endpoint (optional)
- [ ] SSL certificate renewal plan in place

### Code Deployment
- [ ] All 19 implementation tasks completed ✓
- [ ] Code pushed to version control
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables not in code (only in `.env`)
- [ ] Secrets not logged or exposed
- [ ] Build tested locally (`npm run build`)
- [ ] Frontend build optimized
- [ ] No console.log statements with sensitive data

### Testing (Pre-Production)
- [ ] Admin login works with test user
- [ ] New user creation works
- [ ] User role assignment works
- [ ] Permission enforcement tested
- [ ] Audit logs being created
- [ ] Audit logs can be viewed
- [ ] Session timeout works
- [ ] Login attempt limiting works
- [ ] Logout clears tokens
- [ ] Admin route is hidden from public
- [ ] robots.txt is accessible at `/robots.txt`
- [ ] Failed logins logged to audit
- [ ] Account lockout after 5 attempts verified

### Documentation & Training
- [ ] Team trained on new admin system
- [ ] Security policies documented
- [ ] Password requirements communicated
- [ ] Emergency procedures documented
- [ ] Admin playbook created
- [ ] Support contact list updated

---

## Deployment Steps

### 1. Database Migration (If Existing Users)
```bash
# If upgrading from existing system:
# 1. Backup current database
# 2. Run seed script to create roles
npm run seed

# 3. Manually migrate existing admin users to User model
# 4. Verify all data migrated correctly
```

### 2. Server Deployment
```bash
# 1. Clone/pull code to production
git clone <repo> /opt/royaloverseas
cd /opt/royaloverseas

# 2. Install dependencies
npm install --production

# 3. Create production .env (from template)
cp .env.example .env
# Edit .env with production values

# 4. Run seed script
npm run seed

# 5. Build frontend
npm run build

# 6. Start server (using PM2 or similar)
pm2 start server/server.js --name "royal-overseas"
pm2 save
```

### 3. Verify Deployment
```bash
# Check server health
curl http://localhost:5000/api/health

# Test admin login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@royaloverseas.com",
    "password": "ADMIN_PASSWORD"
  }'

# Verify frontend is built
ls -la dist/

# Test admin route access
curl http://localhost:5173/ro-panel-2026
```

### 4. Post-Deployment Verification
- [ ] Admin panel accessible at configured route
- [ ] Login redirects to correct route
- [ ] Dashboard loads successfully
- [ ] User management page works
- [ ] Audit logs can be viewed
- [ ] No errors in console
- [ ] No errors in server logs

---

## Post-Deployment Tasks

### Monitoring & Alerts
- [ ] Set up server monitoring (CPU, memory, disk)
- [ ] Configure log aggregation (e.g., ELK stack)
- [ ] Set up failed login alerts
- [ ] Monitor database performance
- [ ] Configure uptime monitoring
- [ ] Set up SSL certificate expiry alerts

### Maintenance
- [ ] Schedule daily database backups
- [ ] Schedule weekly log archival
- [ ] Review audit logs daily for anomalies
- [ ] Test disaster recovery monthly
- [ ] Update dependencies monthly
- [ ] Review security patches weekly

### Admin Team
- [ ] Create secondary admin account for backup
- [ ] Document admin access procedures
- [ ] Set up admin on-call rotation
- [ ] Create emergency contact list
- [ ] Document password reset procedures
- [ ] Train new admins as needed

### Security Hardening
- [ ] Enable 2FA for all admin accounts
- [ ] Review and update CORS settings
- [ ] Configure rate limiting (API)
- [ ] Set up IP whitelist (optional)
- [ ] Review and rotate JWT_SECRET periodically
- [ ] Test security regularly

---

## Troubleshooting Guide

### Login Not Working
```bash
# 1. Check admin user exists
# Via MongoDB shell:
db.users.findOne({email: "admin@royaloverseas.com"})

# 2. Verify JWT_SECRET is set
echo $JWT_SECRET

# 3. Check server logs
pm2 logs royal-overseas

# 4. Recreate admin user if needed
npm run seed
```

### Routes Not Accessible
```bash
# 1. Verify ADMIN_ROUTE is set
echo $ADMIN_ROUTE

# 2. Check frontend build includes route
grep -r "ADMIN_ROUTE" dist/

# 3. Verify Vite config has ADMIN_ROUTE defined
grep -i "admin_route" vite.config.js

# 4. Clear browser cache and try again
```

### Database Connection Error
```bash
# 1. Check MongoDB is running
sudo systemctl status mongod

# 2. Verify MONGO_URI is correct
echo $MONGO_URI

# 3. Test connection
mongosh "$MONGO_URI"

# 4. Check firewall rules allow connection
```

### Permissions Not Working
```bash
# 1. Verify user has correct role
db.users.findOne({email: "test@example.com"}, {role: 1, permissions: 1})

# 2. Check role exists in Role collection
db.roles.findOne({name: "manager"})

# 3. Verify middleware is applied
grep -A5 "protectRoute" server/app.js

# 4. Check audit logs for permission denials
curl http://localhost:5000/api/audit-logs?action=permission_denied
```

---

## Rollback Plan

If something goes wrong:

### Quick Rollback (< 1 hour downtime)
```bash
# 1. Stop current server
pm2 stop royal-overseas

# 2. Restore from last known good version
git checkout <last-known-good-commit>
npm install

# 3. Restart server
pm2 start royal-overseas

# 4. Verify functionality
curl http://localhost:5000/api/health
```

### Full Rollback (Database reset)
```bash
# 1. Restore database from backup
# Procedure depends on your MongoDB backup solution

# 2. Reset to previous admin system (if applicable)
# Follow previous deployment procedure

# 3. Notify users of downtime
# Update status page
```

---

## Security Verification After Deployment

### Manual Testing
- [ ] Admin route requires authentication
- [ ] Login page doesn't exist at public `/admin`
- [ ] Failed login attempts logged
- [ ] Successful login returns JWT token
- [ ] JWT token expires after 7 days
- [ ] Session timeout works
- [ ] Password hashing verified (bcrypt)
- [ ] Permissions enforced on protected endpoints
- [ ] Audit logs contain accurate information

### Security Scanning
- [ ] Run OWASP ZAP scan on admin routes
- [ ] Check for exposed credentials in logs
- [ ] Verify no debug information exposed
- [ ] Test SQL injection resistance (if applicable)
- [ ] Test XSS prevention
- [ ] Verify CORS headers correct
- [ ] Test CSRF protection
- [ ] Scan for hardcoded secrets

### Compliance
- [ ] GDPR compliance (user data handling)
- [ ] Data retention policy implemented
- [ ] Backup encryption enabled
- [ ] Access logs retained for required period
- [ ] Audit trail complete and verifiable
- [ ] Data deletion working correctly

---

## Performance Optimization

### Before Going Live
- [ ] Enable gzip compression
- [ ] Minimize JWT token size
- [ ] Optimize database queries
- [ ] Index frequently searched fields
- [ ] Configure database connection pooling
- [ ] Set up CDN for static assets
- [ ] Enable browser caching
- [ ] Minify and bundle frontend code

### Monitoring Performance
- [ ] Monitor API response times
- [ ] Check database query performance
- [ ] Monitor disk space usage
- [ ] Monitor memory usage
- [ ] Check authentication overhead
- [ ] Monitor audit log growth rate

---

## Success Criteria

Deployment is successful when:

✓ Admin panel loads at custom route  
✓ Login works with all user types  
✓ Role-based access control enforced  
✓ Audit logs being created and accessible  
✓ Permissions displayed correctly in UI  
✓ No errors in browser console  
✓ No errors in server logs  
✓ Database connection stable  
✓ All API endpoints responding correctly  
✓ Security tests passing  
✓ No performance degradation  
✓ Team trained and ready  

---

## Support & Escalation

### Contact Escalation
1. **Tier 1**: Check logs and documentation
2. **Tier 2**: Review SECURITY.md and API docs
3. **Tier 3**: Contact development team
4. **Tier 4**: Enable debug logging

### Useful Commands

```bash
# View server logs
pm2 logs royal-overseas

# Check application status
pm2 status

# Restart application
pm2 restart royal-overseas

# View database logs
journalctl -u mongod

# Check disk space
df -h

# Monitor processes
top

# View failed logins
curl http://localhost:5000/api/audit-logs?action=login_failed
```

---

## Appendix: Environment Variable Template

```env
# ===== SECURITY =====
JWT_SECRET=your-64-character-random-secret-key-here-minimum-32-chars
JWT_EXPIRY=7d
SESSION_TIMEOUT=1800
ADMIN_ROUTE=ro-panel-2026

# ===== DATABASE =====
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/royaloverseas
MONGO_REPLICA_SET=rs0

# ===== SERVER =====
PORT=5000
NODE_ENV=production

# ===== CLIENT =====
CLIENT_URL=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com
VITE_ADMIN_ROUTE=ro-panel-2026

# ===== ADMIN ACCOUNT =====
ADMIN_EMAIL=admin@royaloverseas.com
ADMIN_PASSWORD=VerySecureInitialPassword123

# ===== OPTIONAL =====
LOG_LEVEL=info
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Approved By**: _______________  
**Environment**: [ ] Development [ ] Staging [ ] Production  

---

**All items checked?** System ready for deployment! ✓
