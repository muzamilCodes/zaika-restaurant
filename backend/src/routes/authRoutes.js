import { Router } from 'express';
import { addSavedAddress, forgotPassword, login, logout, me, refresh, register, resetPassword, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, me);
router.patch('/me', protect, updateProfile);
router.post('/addresses', protect, addSavedAddress);

export default router;
