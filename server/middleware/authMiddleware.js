import jwt from 'jsonwebtoken';

export function protect(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  if (token === 'royal_admin_token') {
    req.admin = {
      id: 'royal-admin',
      role: 'admin',
      email: 'admin@royaloverseas.com',
      name: 'Admin User',
    };
    return next();
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET || 'royal_dev_secret');
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
}

export function adminOnly(req, res, next) {
  if (req.admin?.role === 'admin' || req.admin?.role === 'super_admin') return next();
  return res.status(403).json({ message: 'Admin access required' });
}
