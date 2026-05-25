import AuditLog from '../models/AuditLog.js';

export async function logAudit(req, res, next) {
  // Capture original send method
  const originalSend = res.send;

  res.send = function (data) {
    res.send = originalSend;

    // Only log admin actions
    if (req.user && req.path.includes('/admin') && req.method !== 'GET') {
      const statusCode = res.statusCode;
      const isSuccess = statusCode >= 200 && statusCode < 300;

      AuditLog.create({
        userId: req.user._id,
        userEmail: req.user.email,
        action: getActionFromMethod(req.method),
        resource: getResourceFromPath(req.path),
        resourceId: req.params.id || req.body?.id,
        details: `${req.method} ${req.path}`,
        status: isSuccess ? 'success' : 'failure',
        statusCode,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      }).catch((err) => console.error('Audit log error:', err));
    }

    return res.send(data);
  };

  next();
}

function getActionFromMethod(method) {
  const actions = {
    GET: 'view',
    POST: 'create',
    PUT: 'update',
    PATCH: 'update',
    DELETE: 'delete',
  };
  return actions[method] || 'view';
}

function getResourceFromPath(path) {
  const resources = {
    '/users': 'user',
    '/products': 'product',
    '/gallery': 'gallery',
    '/inquiries': 'inquiry',
    '/customers': 'customer',
    '/settings': 'settings',
    '/roles': 'role',
    '/departments': 'department',
    '/notifications': 'notification',
  };

  for (const [route, resource] of Object.entries(resources)) {
    if (path.includes(route)) return resource;
  }

  return 'unknown';
}
