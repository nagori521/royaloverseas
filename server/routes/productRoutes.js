import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, upload.array('images', 8), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 8), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
