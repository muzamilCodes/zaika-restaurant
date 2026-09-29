import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    guests: { type: Number, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    specialRequests: { type: String },
    isOtpVerified: { type: Boolean, default: false },
    otpHash: { type: String },
    otpExpiresAt: { type: Date },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  },
  { timestamps: true }
);

export const Reservation = mongoose.model('Reservation', reservationSchema);
