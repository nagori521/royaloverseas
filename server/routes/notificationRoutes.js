import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Get notifications for current user
router.get('/', getNotifications);

// Mark notification as read
router.post('/:id/read', markAsRead);

// Mark all notifications as read
router.post('/read/all', markAllAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

export default router;
