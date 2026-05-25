export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role === 'admin') return next();

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Insufficient permissions',
        required: roles,
        current: req.user.role,
      });
    }

    next();
  };
}

export function requireRoleAtLeast(minRole) {
  const roleHierarchy = {
    super_admin: 4,
    admin: 3,
    manager: 2,
    staff: 1,
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if ((roleHierarchy[req.user.role] || 0) < (roleHierarchy[minRole] || 0)) {
      return res.status(403).json({
        message: 'Insufficient role permissions',
        required: minRole,
        current: req.user.role,
      });
    }

    next();
  };
}
