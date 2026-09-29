import { z } from 'zod';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';

export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cartItems.product');
  res.json({ cartItems: user.cartItems || [] });
});

export const addToCart = asyncHandler(async (req, res) => {
  const body = z.object({
    productId: z.string(),
    quantity: z.number().min(1).optional()
  }).parse({
    ...req.body,
    quantity: Number(req.body.quantity || 1)
  });

  const product = await Product.findById(body.productId);
  if (!product) throw new AppError('Product not found', 404);

  const user = await User.findById(req.user._id);
  const existing = user.cartItems.find((item) => item.product.toString() === body.productId);

  if (existing) {
    existing.quantity += body.quantity;
  } else {
    user.cartItems.push({ product: product._id, quantity: body.quantity });
  }

  await user.save();
  res.json({ message: 'Added to cart' });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const body = z.object({ quantity: z.number().min(1) }).parse({
    quantity: Number(req.body.quantity)
  });

  const user = await User.findById(req.user._id);
  const item = user.cartItems.id(req.params.itemId);
  if (!item) throw new AppError('Cart item not found', 404);

  item.quantity = body.quantity;
  await user.save();
  res.json({ message: 'Cart updated' });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cartItems = user.cartItems.filter((item) => item._id.toString() !== req.params.itemId);
  await user.save();
  res.json({ message: 'Item removed' });
});

export const clearCart = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { cartItems: [] });
  res.json({ message: 'Cart cleared' });
});
