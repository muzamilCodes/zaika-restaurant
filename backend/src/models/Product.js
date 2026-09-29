import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }],
    ingredients: [{ type: String }],
    tags: [{ type: String }],
    spiceLevel: { type: String, enum: ['mild', 'medium', 'hot'], default: 'medium' },
    isVeg: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    createdByAdmin: { type: Boolean, default: false },
    preparationTime: { type: Number, default: 20 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
