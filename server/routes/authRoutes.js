import express from 'express';
import { loginAdmin, logoutAdmin, refreshToken, getCurrentUser } from '../controllers/authController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', protectRoute, logoutAdmin);
router.post('/refresh-token', protectRoute, refreshToken);
router.get('/me', protectRoute, getCurrentUser);

export default router;
