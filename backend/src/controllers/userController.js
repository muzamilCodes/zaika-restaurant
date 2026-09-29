import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { AppError } from '../utils/appError.js';

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password -refreshTokens').sort({ createdAt: -1 });
  res.json({ users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -refreshTokens');
  if (!user) throw new AppError('User not found', 404);
  const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(20);
  res.json({ user, orders });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json({ message: 'User deleted' });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const index = user.wishlist.findIndex((id) => id.toString() === productId);

  if (index >= 0) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  res.json({ wishlist: user.wishlist });
});
