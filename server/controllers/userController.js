import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, password, role, permissions, departments, status } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role,
      permissions: permissions || [],
      departments: departments || [],
      status: status || 'active',
    });

    await user.save();

    // Log this action
    await AuditLog.create({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'create',
      resource: 'user',
      resourceId: user._id,
      details: `Created user: ${user.email} with role: ${user.role}`,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await req.user.addAuditLog('create_user', `Created user: ${user.email}`, req.ip, req.get('user-agent'));

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role, permissions, departments, status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const changes = [];

    if (name && name !== user.name) {
      changes.push(`name: ${user.name} → ${name}`);
      user.name = name;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      changes.push(`email: ${user.email} → ${email}`);
      user.email = email;
    }

    if (role && role !== user.role) {
      changes.push(`role: ${user.role} → ${role}`);
      user.role = role;
    }

    if (permissions && JSON.stringify(permissions) !== JSON.stringify(user.permissions)) {
      changes.push(`permissions updated`);
      user.permissions = permissions;
    }

    if (departments && JSON.stringify(departments) !== JSON.stringify(user.departments)) {
      changes.push(`departments updated`);
      user.departments = departments;
    }

    if (status && status !== user.status) {
      changes.push(`status: ${user.status} → ${status}`);
      user.status = status;
    }

    if (changes.length === 0) {
      return res.json({ message: 'No changes made', user: user.toJSON() });
    }

    await user.save();

    // Log this action
    await AuditLog.create({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'update',
      resource: 'user',
      resourceId: user._id,
      details: `Updated user ${user.email}: ${changes.join(', ')}`,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await req.user.addAuditLog('update_user', `Updated user: ${user.email}`, req.ip, req.get('user-agent'));

    res.json({
      message: 'User updated successfully',
      changes,
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
}

export async function updateUserPassword(req, res) {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    const user = await User.findById(id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const passwordMatch = await user.matchPassword(currentPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    user.lastPasswordChange = new Date();
    await user.save();

    await AuditLog.create({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'update',
      resource: 'user',
      resourceId: user._id,
      details: `Changed password for user: ${user.email}`,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update password', error: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Prevent deleting super_admin users
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot delete super admin users' });
    }

    await User.findByIdAndDelete(id);

    await AuditLog.create({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'delete',
      resource: 'user',
      resourceId: user._id,
      details: `Deleted user: ${user.email}`,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
}

export async function disableUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { status: 'inactive' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await AuditLog.create({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'update',
      resource: 'user',
      resourceId: user._id,
      details: `Disabled user: ${user.email}`,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      message: 'User disabled successfully',
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to disable user', error: err.message });
  }
}

export async function enableUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await AuditLog.create({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'update',
      resource: 'user',
      resourceId: user._id,
      details: `Enabled user: ${user.email}`,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      message: 'User enabled successfully',
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to enable user', error: err.message });
  }
}

export async function assignRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['super_admin', 'manager', 'staff'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await AuditLog.create({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'update',
      resource: 'user',
      resourceId: user._id,
      details: `Assigned role '${role}' to user: ${user.email}`,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      message: 'Role assigned successfully',
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign role', error: err.message });
  }
}

export async function assignPermissions(req, res) {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: 'Permissions must be an array' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { permissions },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await AuditLog.create({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'update',
      resource: 'user',
      resourceId: user._id,
      details: `Updated permissions for user: ${user.email}`,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      message: 'Permissions assigned successfully',
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign permissions', error: err.message });
  }
}

export async function assignDepartments(req, res) {
  try {
    const { id } = req.params;
    const { departments } = req.body;

    if (!Array.isArray(departments)) {
      return res.status(400).json({ message: 'Departments must be an array' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { departments },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await AuditLog.create({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'update',
      resource: 'user',
      resourceId: user._id,
      details: `Updated departments for user: ${user.email}`,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.json({
      message: 'Departments assigned successfully',
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign departments', error: err.message });
  }
}
