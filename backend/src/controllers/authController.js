import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Address } from '../models/Address.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { issueTokenPair } from '../services/tokenService.js';
import { hashToken, verifyRefreshToken } from '../utils/token.js';
import { sendEmail } from '../utils/sendEmail.js';

const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  name: z.string().min(2).trim(),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6)
});

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional()
});

const forgotPasswordSchema = z.object({
  email: z.string().email().trim().toLowerCase()
});

const resetPasswordSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  token: z.string().min(10),
  password: z.string().min(6)
});

const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(2),
  phone: z.string().min(6),
  addressLine1: z.string().min(3),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pinCode: z.string().min(4),
  landmark: z.string().optional(),
  isDefault: z.boolean().optional()
});

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
}

async function saveRefreshToken(user, refreshToken, req) {
  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push({
    tokenHash: hashToken(refreshToken),
    userAgent: req.get('user-agent') || 'unknown',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });
  await user.save({ validateBeforeSave: false });
}

function sanitizeUser(user) {
  const cleanedRole = String(user.role || '').replace(/["']/g, '').trim().toLowerCase();
  const isAdmin = user.isAdmin === true || cleanedRole.includes('admin');
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: isAdmin ? 'admin' : 'customer',
    isAdmin,
    avatar: user.avatar
  };
}

export const register = asyncHandler(async (req, res) => {
  const body = registerSchema.parse(req.body);
  const existingUser = await User.findOne({ email: body.email });

  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const user = await User.create({
    name: body.name,
    email: body.email,
    password: body.password,
    role: 'customer',
    isAdmin: false
  });

  const { accessToken, refreshToken } = issueTokenPair(user);
  await saveRefreshToken(user, refreshToken, req);
  setRefreshCookie(res, refreshToken);

  res.status(201).json({
    accessToken,
    user: sanitizeUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const body = loginSchema.parse(req.body);
  const user = await User.findOne({ email: body.email }).select('+password');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await user.comparePassword(body.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const { accessToken, refreshToken } = issueTokenPair(user);
  await saveRefreshToken(user, refreshToken, req);
  setRefreshCookie(res, refreshToken);

  res.json({
    accessToken,
    user: sanitizeUser(user)
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) {
    throw new AppError('Refresh token required', 401);
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User not found', 401);
  }

  const tokenHash = hashToken(token);
  const tokenExists = (user.refreshTokens || []).some((entry) => entry.tokenHash === tokenHash);
  if (!tokenExists) {
    throw new AppError('Refresh token expired', 401);
  }

  const { accessToken, refreshToken } = issueTokenPair(user);
  user.refreshTokens = user.refreshTokens.filter((entry) => entry.tokenHash !== tokenHash);
  await saveRefreshToken(user, refreshToken, req);
  setRefreshCookie(res, refreshToken);

  res.json({ accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (token) {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await User.findById(decoded.id);
      if (user) {
        const tokenHash = hashToken(token);
        user.refreshTokens = (user.refreshTokens || []).filter((entry) => entry.tokenHash !== tokenHash);
        await user.save({ validateBeforeSave: false });
      }
    } catch {
      // ignore invalid token during logout
    }
  }

  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -refreshTokens')
    .populate('wishlist')
    .populate('savedAddresses');

  res.json({ user: sanitizeUser(user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const body = profileSchema.parse(req.body);
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (body.name !== undefined) user.name = body.name;
  if (body.phone !== undefined) user.phone = body.phone;
  if (body.avatar !== undefined) user.avatar = body.avatar;

  await user.save();

  res.json({
    user: sanitizeUser(user)
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const body = forgotPasswordSchema.parse(req.body);
  const user = await User.findOne({ email: body.email });

  if (!user) {
    return res.json({ success: true, message: 'If the email exists, a reset link will be sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordTokenHash = hashToken(resetToken);
  user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetLink = `${clientUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(body.email)}`;
  let emailSent = false;
  try {
    await sendEmail({
      to: body.email,
      subject: 'Reset your Zaika password',
      html: `<p>Use this link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`
    });
    emailSent = true;
  } catch {
    emailSent = false;
  }

  res.json({
    success: true,
    message: emailSent ? 'Password reset link sent.' : 'Reset link prepared for development.',
    devResetLink: process.env.NODE_ENV !== 'production' ? resetLink : undefined
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const body = resetPasswordSchema.parse(req.body);
  const user = await User.findOne({ email: body.email });

  if (
    !user ||
    !user.resetPasswordTokenHash ||
    user.resetPasswordTokenHash !== hashToken(body.token) ||
    !user.resetPasswordExpiresAt ||
    user.resetPasswordExpiresAt < new Date()
  ) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = body.password;
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  res.json({ success: true, message: 'Password reset successfully' });
});

export const addSavedAddress = asyncHandler(async (req, res) => {
  const body = addressSchema.parse(req.body);
  const address = await Address.create({
    ...body,
    user: req.user._id
  });

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { savedAddresses: address._id }
  });

  res.status(201).json({ address });
});
