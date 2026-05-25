import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  disableUser,
  enableUser,
  assignRole,
  assignPermissions,
  assignDepartments,
} from '../controllers/userController.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Only super_admin can manage users
router.use(requirePermission('users_manage'));

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Create new user
router.post('/', createUser);

// Update user
router.put('/:id', updateUser);

// Change user password
router.post('/:id/change-password', updateUserPassword);

// Delete user
router.delete('/:id', deleteUser);

// Disable user
router.post('/:id/disable', disableUser);

// Enable user
router.post('/:id/enable', enableUser);

// Assign role to user
router.post('/:id/assign-role', assignRole);

// Assign permissions to user
router.post('/:id/assign-permissions', assignPermissions);

// Assign departments to user
router.post('/:id/assign-departments', assignDepartments);

export default router;
