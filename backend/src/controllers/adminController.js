import { asyncHandler } from '../utils/asyncHandler.js';
import { Order } from '../models/Order.js';
import { Reservation } from '../models/Reservation.js';
import { User } from '../models/User.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [orders, customers, reservations, revenueAgg, recentOrders, recentReservations] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Reservation.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, revenue: { $sum: '$total' } } }
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5).select('orderNumber total status paymentMethod createdAt'),
    Reservation.find().sort({ createdAt: -1 }).limit(5).select('name guests date time status isOtpVerified')
  ]);

  res.json({
    stats: {
      orders,
      customers,
      reservations,
      revenue: revenueAgg[0]?.revenue || 0
    },
    recentOrders,
    recentReservations
  });
});

export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ orders });
});

export const getAllReservations = asyncHandler(async (_req, res) => {
  const reservations = await Reservation.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ reservations });
});
