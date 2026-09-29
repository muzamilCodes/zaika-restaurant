import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

export function createRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      'Missing Razorpay credentials. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env'
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
}

