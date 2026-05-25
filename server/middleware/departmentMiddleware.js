export function requireDepartment(...departments) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Super admin bypasses department restrictions
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Check if user has at least one of the required departments
    const hasDepartment = departments.some((dept) => req.user.departments.includes(dept));

    if (!hasDepartment && req.user.departments.length > 0) {
      return res.status(403).json({
        message: 'Department access denied',
        required: departments,
        current: req.user.departments,
      });
    }

    next();
  };
}

export function filterByDepartment(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Super admin sees everything
  if (req.user.role === 'super_admin') {
    req.departmentFilter = null;
    return next();
  }

  // Store department filter in request for queries
  if (req.user.departments.length === 0) {
    // User has no departments assigned, restrict access
    req.departmentFilter = { $in: [] }; // Empty array ensures no results
  } else {
    req.departmentFilter = { $in: req.user.departments };
  }

  next();
}
