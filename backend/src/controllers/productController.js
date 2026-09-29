import { z } from 'zod';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { makeSlug } from '../utils/slug.js';
import { uploadBufferToCloudinary } from '../services/uploadService.js';

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().nonnegative(),
  discountedPrice: z.number().nonnegative().optional(),
  category: z.string().min(1),
  images: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  spiceLevel: z.enum(['mild', 'medium', 'hot']).optional(),
  isVeg: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  preparationTime: z.number().optional()
});

export const getProducts = asyncHandler(async (req, res) => {
  const { q, category, featured, includeSeeded } = req.query;
  const filter = {};

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ];
  }

  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;
  if (includeSeeded !== 'true') filter.createdByAdmin = true;

  const products = await Product.find(filter).populate('category').sort({ createdAt: -1 });
  res.json({ products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    createdByAdmin: true
  }).populate('category');
  if (!product) throw new AppError('Product not found', 404);

  const relatedProducts = await Product.find({
    category: product.category?._id,
    _id: { $ne: product._id },
    createdByAdmin: true
  })
    .limit(6)
    .populate('category');

  res.json({ product, relatedProducts });
});

export const createProduct = asyncHandler(async (req, res) => {
  const body = productSchema.parse({
    ...req.body,
    price: Number(req.body.price),
    discountedPrice: req.body.discountedPrice ? Number(req.body.discountedPrice) : undefined,
    isVeg: req.body.isVeg === 'true' || req.body.isVeg === true,
    isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
    isAvailable: req.body.isAvailable !== 'false',
    preparationTime: req.body.preparationTime ? Number(req.body.preparationTime) : undefined,
    images: Array.isArray(req.body.images)
      ? req.body.images
      : req.body.images
        ? [req.body.images]
        : req.body.image
          ? [req.body.image]
          : []
  });

  const category = await Category.findById(body.category);
  if (!category) throw new AppError('Category not found', 404);

  const product = await Product.create({
    ...body,
    slug: makeSlug(body.name),
    createdByAdmin: true
  });

  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const body = {
    ...req.body
  };

  if (body.name) body.slug = makeSlug(body.name);
  const product = await Product.findByIdAndUpdate(req.params.id, body, { new: true });
  if (!product) throw new AppError('Product not found', 404);
  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new AppError('Product not found', 404);
  res.json({ message: 'Product deleted' });
});

export const uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.length) {
    throw new AppError('No files uploaded', 400);
  }

  const uploaded = [];
  for (const file of req.files) {
    const result = await uploadBufferToCloudinary(file.buffer, file.mimetype, 'zaika/products');
    uploaded.push(result.secure_url);
  }

  const images = uploaded;
  res.json({ images });
});
