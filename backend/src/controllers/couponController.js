import { z } from 'zod';
import { Coupon } from '../models/Coupon.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';

const couponSchema = z.object({
  code: z.string().min(2),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(1),
  minimumOrderAmount: z.number().optional(),
  maxDiscountAmount: z.number().optional(),
  expiresAt: z.string().optional(),
  usageLimit: z.number().optional(),
  isActive: z.boolean().optional()
});

export const listCoupons = asyncHandler(async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const body = couponSchema.parse({
    ...req.body,
    discountValue: Number(req.body.discountValue),
    minimumOrderAmount: req.body.minimumOrderAmount ? Number(req.body.minimumOrderAmount) : 0,
    maxDiscountAmount: req.body.maxDiscountAmount ? Number(req.body.maxDiscountAmount) : undefined,
    usageLimit: req.body.usageLimit ? Number(req.body.usageLimit) : undefined,
    expiresAt: req.body.expiresAt || undefined
  });

  const coupon = await Coupon.create({
    ...body,
    code: body.code.toUpperCase(),
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined
  });

  res.status(201).json({ coupon });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const payload = {};
  for (const key of Object.keys(req.body)) {
    payload[key] = req.body[key];
  }

  if (payload.code) payload.code = String(payload.code).toUpperCase();
  if (payload.expiresAt) payload.expiresAt = new Date(payload.expiresAt);

  const coupon = await Coupon.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!coupon) throw new AppError('Coupon not found', 404);
  res.json({ coupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new AppError('Coupon not found', 404);
  res.json({ message: 'Coupon deleted' });
});
