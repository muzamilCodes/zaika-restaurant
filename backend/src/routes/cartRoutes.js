import { Router } from 'express';
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.patch('/:itemId', protect, updateCartItem);
router.delete('/:itemId', protect, removeCartItem);
router.delete('/', protect, clearCart);

export default router;
