import { Router } from 'express';
import { createGalleryItem, deleteGalleryItem, listAdminGalleryItems, listGalleryItems } from '../controllers/galleryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', listGalleryItems);
router.get('/admin', protect, authorize('admin'), listAdminGalleryItems);
router.post('/', protect, authorize('admin'), createGalleryItem);
router.delete('/:id', protect, authorize('admin'), deleteGalleryItem);

export default router;
