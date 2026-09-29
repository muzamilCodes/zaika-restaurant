import { Router } from 'express';
import {
  cancelMyOrder,
  createOrder,
  generateInvoice,
  getMyOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/track/:orderNumber', trackOrder);
router.get('/:id/invoice', protect, generateInvoice);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.patch('/:id/cancel', protect, cancelMyOrder);

export default router;
