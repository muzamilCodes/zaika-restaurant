import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: String, enum: ['razorpay', 'cod'], default: 'razorpay' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['created', 'captured', 'failed', 'refunded'], default: 'created' },
    providerOrderId: String,
    providerPaymentId: String,
    providerSignature: String
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
