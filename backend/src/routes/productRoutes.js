import { Router } from 'express';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct, uploadProductImages } from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('admin'), createProduct);
router.patch('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post('/upload-images', protect, authorize('admin'), upload.array('images', 10), uploadProductImages);

export default router;
