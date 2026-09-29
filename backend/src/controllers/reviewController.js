import { z } from 'zod';
import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';

export const createReview = asyncHandler(async (req, res) => {
  const body = z.object({
    productId: z.string(),
    rating: z.number().min(1).max(5),
    title: z.string().optional(),
    comment: z.string().optional()
  }).parse({
    ...req.body,
    rating: Number(req.body.rating)
  });

  const product = await Product.findById(body.productId);
  if (!product) throw new AppError('Product not found', 404);

  const review = await Review.create({
    user: req.user._id,
    product: body.productId,
    rating: body.rating,
    title: body.title,
    comment: body.comment
  });

  const reviews = await Review.find({ product: body.productId, isApproved: true });
  const avg = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
  product.rating = Number(avg.toFixed(1));
  product.reviewCount = reviews.length;
  await product.save();

  res.status(201).json({ review });
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, isApproved: true })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ reviews });
});
