export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role === 'super_admin' || req.user.role === 'admin') {
      return next();
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        message: 'Permission denied',
        required: permission,
        current: req.user.permissions,
      });
    }

    next();
  };
}

export function requireAnyPermission(...permissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role === 'super_admin' || req.user.role === 'admin') {
      return next();
    }

    const hasAny = permissions.some((perm) => req.user.permissions.includes(perm));

    if (!hasAny) {
      return res.status(403).json({
        message: 'Insufficient permissions',
        required: permissions,
        current: req.user.permissions,
      });
    }

    next();
  };
}

export function requireAllPermissions(...permissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role === 'super_admin' || req.user.role === 'admin') {
      return next();
    }

    const hasAll = permissions.every((perm) => req.user.permissions.includes(perm));

    if (!hasAll) {
      return res.status(403).json({
        message: 'Insufficient permissions',
        required: permissions,
        current: req.user.permissions,
      });
    }

    next();
  };
}
