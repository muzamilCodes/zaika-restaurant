import crypto from 'crypto';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { verifyRazorpaySignature } from '../services/paymentService.js';

export const verifyPayment = asyncHandler(async (req, res) => {
  const body = z.object({
    razorpayOrderId: z.string(),
    razorpayPaymentId: z.string(),
    razorpaySignature: z.string()
  }).parse(req.body);

  const order = await Order.findOne({ razorpayOrderId: body.razorpayOrderId });
  if (!order) throw new AppError('Order not found', 404);

  const valid = verifyRazorpaySignature({
    orderId: body.razorpayOrderId,
    paymentId: body.razorpayPaymentId,
    signature: body.razorpaySignature
  });

  if (!valid) throw new AppError('Invalid payment signature', 400);

  order.paymentStatus = 'paid';
  order.razorpayPaymentId = body.razorpayPaymentId;
  order.status = 'confirmed';
  await order.save();

  await Payment.findOneAndUpdate(
    { providerOrderId: body.razorpayOrderId },
    {
      providerPaymentId: body.razorpayPaymentId,
      providerSignature: body.razorpaySignature,
      status: 'captured'
    }
  );

  res.json({ message: 'Payment verified', order });
});

export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount, receipt } = z.object({
    amount: z.number(),
    receipt: z.string().optional()
  }).parse({
    amount: Number(req.body.amount),
    receipt: req.body.receipt
  });

  res.json({
    keyId: process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY || '',
    amount: Math.round(amount * 100),
    receipt
  });
});
