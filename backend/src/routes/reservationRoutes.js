import { Router } from 'express';
import { createReservation, getReservations, sendReservationOtp, updateReservationStatus, verifyReservationOtp } from '../controllers/reservationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', createReservation);
router.post('/send-otp', sendReservationOtp);
router.post('/verify-otp', verifyReservationOtp);
router.get('/mine', protect, getReservations);
router.patch('/:id/status', protect, authorize('admin'), updateReservationStatus);

export default router;
