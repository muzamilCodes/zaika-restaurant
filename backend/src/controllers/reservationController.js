import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { Reservation } from '../models/Reservation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { sendEmail } from '../utils/sendEmail.js';

const reservationSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().trim().toLowerCase(),
  guests: z.number().min(1).max(20),
  date: z.string(),
  time: z.string(),
  specialRequests: z.string().optional()
});

const verifySchema = z.object({
  verificationToken: z.string().min(20),
  otp: z.string().length(6)
});

function parseReservationBody(payload) {
  return reservationSchema.parse({
    ...payload,
    guests: Number(payload.guests)
  });
}

function buildOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function buildVerificationToken(payload) {
  const secret = process.env.RESERVATION_OTP_SECRET || process.env.JWT_ACCESS_SECRET || process.env.SECRET_KEY;
  if (!secret) {
    throw new AppError('Reservation OTP secret is not configured', 500);
  }

  return jwt.sign(payload, secret, {
    expiresIn: '10m'
  });
}

function decodeVerificationToken(token) {
  const secret = process.env.RESERVATION_OTP_SECRET || process.env.JWT_ACCESS_SECRET || process.env.SECRET_KEY;
  if (!secret) {
    throw new AppError('Reservation OTP secret is not configured', 500);
  }

  return jwt.verify(token, secret);
}

export const sendReservationOtp = asyncHandler(async (req, res) => {
  const body = parseReservationBody(req.body);

  const otp = buildOtp();
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const draftReservation = await Reservation.findOneAndUpdate(
    {
      email: body.email,
      phone: body.phone,
      date: new Date(body.date),
      time: body.time,
      isOtpVerified: false
    },
    {
      ...body,
      guests: Number(body.guests),
      date: new Date(body.date),
      status: 'pending',
      isOtpVerified: false,
      otpHash,
      otpExpiresAt
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const verificationToken = buildVerificationToken({
    reservationId: draftReservation._id,
    otpHash
  });

  let emailSent = false;
  try {
    await sendEmail({
      to: body.email,
      subject: 'Your Zaika reservation OTP',
      html: `<h2>Your OTP is ${otp}</h2><p>Valid for 10 minutes.</p>`
    });
    emailSent = true;
  } catch {
    emailSent = false;
  }

  res.json({
    success: true,
    message: emailSent ? 'OTP sent to email' : 'Email not configured. Use the OTP from dev response.',
    verificationToken,
    emailSent,
    devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
  });
});

export const createReservation = asyncHandler(async (req, res) => {
  const body = parseReservationBody(req.body);

  const reservation = await Reservation.create({
    ...body,
    guests: Number(body.guests),
    date: new Date(body.date),
    status: 'pending',
    isOtpVerified: true
  });

  res.status(201).json({
    success: true,
    message: 'Reservation confirmed. Our team will contact you soon.',
    reservation
  });
});

export const verifyReservationOtp = asyncHandler(async (req, res) => {
  const body = verifySchema.parse(req.body);

  let decoded;
  try {
    decoded = decodeVerificationToken(body.verificationToken);
  } catch {
    throw new AppError('Verification token expired or invalid', 400);
  }

  const enteredHash = crypto.createHash('sha256').update(body.otp).digest('hex');
  if (decoded.otpHash !== enteredHash) {
    throw new AppError('Invalid OTP', 400);
  }

  const reservation = await Reservation.findById(decoded.reservationId);
  if (!reservation) {
    throw new AppError('Reservation draft not found', 404);
  }

  if (reservation.isOtpVerified) {
    throw new AppError('Reservation already verified', 400);
  }

  if (!reservation.otpHash || reservation.otpHash !== enteredHash) {
    throw new AppError('Invalid OTP', 400);
  }

  if (!reservation.otpExpiresAt || reservation.otpExpiresAt < new Date()) {
    throw new AppError('OTP expired', 400);
  }

  reservation.isOtpVerified = true;
  reservation.otpHash = undefined;
  reservation.otpExpiresAt = undefined;
  reservation.status = 'pending';
  await reservation.save();

  res.status(201).json({
    success: true,
    message: 'Reservation confirmed',
    reservation
  });
});

export const getReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user?._id, isOtpVerified: true }).sort({ createdAt: -1 });
  res.json({ reservations });
});

export const updateReservationStatus = asyncHandler(async (req, res) => {
  const body = z.object({
    status: z.enum(['pending', 'accepted', 'rejected'])
  }).parse(req.body);

  const reservation = await Reservation.findByIdAndUpdate(req.params.id, body, { new: true });
  if (!reservation) throw new AppError('Reservation not found', 404);
  res.json({ reservation });
});

export const deleteReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);
  if (!reservation) throw new AppError('Reservation not found', 404);
  res.json({ message: 'Reservation deleted' });
});
