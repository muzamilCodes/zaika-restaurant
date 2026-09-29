import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: String,
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    minimumOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Coupon = mongoose.model('Coupon', couponSchema);
