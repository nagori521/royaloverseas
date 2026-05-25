import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'royal_dev_secret', {
    expiresIn: process.env.JWT_EXPIRY || '7d',
  });
}

export async function loginAdmin(req, res) {
  const { email, password } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get('user-agent');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // Log failed login attempt
      await AuditLog.create({
        action: 'login_failed',
        details: `Failed login attempt for non-existent user: ${email}`,
        status: 'failure',
        statusCode: 401,
        ipAddress,
        userAgent,
      });
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      await AuditLog.create({
        userId: user._id,
        userEmail: user.email,
        action: 'login_failed',
        details: 'Login attempt on locked account',
        status: 'failure',
        statusCode: 423,
        ipAddress,
        userAgent,
      });
      return res.status(423).json({
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      await AuditLog.create({
        userId: user._id,
        userEmail: user.email,
        action: 'login_failed',
        details: 'Login attempt on inactive account',
        status: 'failure',
        statusCode: 403,
        ipAddress,
        userAgent,
      });
      return res.status(403).json({ message: 'Account is inactive' });
    }

    // Verify password
    const passwordMatch = await user.matchPassword(password);

    if (!passwordMatch) {
      await user.incLoginAttempts();
      await AuditLog.create({
        userId: user._id,
        userEmail: user.email,
        action: 'login_failed',
        details: `Invalid password. Attempt ${user.loginAttempts} of 5`,
        status: 'failure',
        statusCode: 401,
        ipAddress,
        userAgent,
      });
      return res.status(401).json({
        message: 'Invalid email or password',
        attemptsRemaining: Math.max(0, 5 - user.loginAttempts),
      });
    }

    // Successful login
    await user.resetLoginAttempts();
    await user.addAuditLog('login', 'User logged in', ipAddress, userAgent);

    const token = signToken(user._id);

    res.json({
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

export async function logoutAdmin(req, res) {
  try {
    if (req.user) {
      const ipAddress = req.ip;
      const userAgent = req.get('user-agent');
      await req.user.addAuditLog('logout', 'User logged out', ipAddress, userAgent);
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
}

export async function refreshToken(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const token = signToken(req.user._id);
    res.json({ token });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ message: 'Token refresh failed', error: err.message });
  }
}

export async function getCurrentUser(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Update last activity
    req.user.lastActivity = new Date();
    await req.user.save();

    res.json(req.user.toJSON());
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
}
