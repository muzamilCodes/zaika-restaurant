import { Router } from 'express';
import { deleteUser, getUserById, getUsers, toggleWishlist } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.post('/wishlist/:productId', protect, toggleWishlist);

export default router;
