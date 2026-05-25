import express from 'express';
import {
  createGalleryImage,
  deleteGalleryImage,
  getGallery,
  updateGalleryImage,
} from '../controllers/galleryController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getGallery);
router.post('/', protect, adminOnly, upload.single('image'), createGalleryImage);
router.put('/:id', protect, adminOnly, upload.single('image'), updateGalleryImage);
router.delete('/:id', protect, adminOnly, deleteGalleryImage);

export default router;
