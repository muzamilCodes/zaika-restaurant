import crypto from 'crypto';
import { createRazorpayClient } from '../config/razorpay.js';

export function createRazorpayOrder({ amount, currency = 'INR', receipt }) {
  const razorpay = createRazorpayClient();
  return razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt
  });
}

export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;
  if (!keySecret) {
    throw new Error('Missing Razorpay secret. Set RAZORPAY_KEY_SECRET in backend/.env');
  }

  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expected === signature;
}
