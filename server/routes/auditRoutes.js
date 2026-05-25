import express from 'express';
import {
  getAllAuditLogs,
  getAuditLogById,
  getUserAuditLogs,
  getAuditLogStats,
  deleteOldAuditLogs,
} from '../controllers/auditController.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Only super_admin can view audit logs
router.use(requirePermission('audit_logs_view'));

// Get all audit logs (paginated)
router.get('/', getAllAuditLogs);

// Get audit stats
router.get('/stats/overview', getAuditLogStats);

// Get audit logs for specific user
router.get('/user/:userId', getUserAuditLogs);

// Get audit log by ID
router.get('/:id', getAuditLogById);

// Delete old audit logs (only super_admin)
router.delete('/cleanup/old', requireRole('super_admin'), deleteOldAuditLogs);

export default router;
