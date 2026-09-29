import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    comment: String,
    isApproved: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Review = mongoose.model('Review', reviewSchema);
