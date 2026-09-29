import { Router } from 'express';
import { getAllOrders, getAllReservations, getDashboardStats } from '../controllers/adminController.js';
import { deleteContactMessage, listContactMessages, markContactMessageRead } from '../controllers/contactController.js';
import { deleteOrder } from '../controllers/orderController.js';
import { deleteReservation } from '../controllers/reservationController.js';
import { createCoupon, deleteCoupon, listCoupons, updateCoupon } from '../controllers/couponController.js';
import { protect, authorize } from '../middleware/auth.js';
import { deleteGalleryItem, listAdminGalleryItems } from '../controllers/galleryController.js';

const router = Router();

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/orders', protect, authorize('admin'), getAllOrders);
router.delete('/orders/:id', protect, authorize('admin'), deleteOrder);
router.get('/reservations', protect, authorize('admin'), getAllReservations);
router.delete('/reservations/:id', protect, authorize('admin'), deleteReservation);
router.get('/contacts', protect, authorize('admin'), listContactMessages);
router.patch('/contacts/:id/read', protect, authorize('admin'), markContactMessageRead);
router.delete('/contacts/:id', protect, authorize('admin'), deleteContactMessage);
router.get('/gallery', protect, authorize('admin'), listAdminGalleryItems);
router.delete('/gallery/:id', protect, authorize('admin'), deleteGalleryItem);
router.get('/coupons', protect, authorize('admin'), listCoupons);
router.post('/coupons', protect, authorize('admin'), createCoupon);
router.patch('/coupons/:id', protect, authorize('admin'), updateCoupon);
router.delete('/coupons/:id', protect, authorize('admin'), deleteCoupon);

export default router;
