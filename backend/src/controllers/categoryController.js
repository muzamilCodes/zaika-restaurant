import { z } from 'zod';
import { Category } from '../models/Category.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { makeSlug } from '../utils/slug.js';

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  res.json({ categories });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);
  res.json({ category });
});

export const createCategory = asyncHandler(async (req, res) => {
  const body = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    icon: z.string().optional(),
    isActive: z.boolean().optional(),
    order: z.number().optional()
  }).parse(req.body);

  const category = await Category.create({ ...body, slug: makeSlug(body.name) });
  res.status(201).json({ category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const body = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    isActive: z.boolean().optional(),
    order: z.number().optional()
  }).parse(req.body);

  if (body.name) body.slug = makeSlug(body.name);
  const category = await Category.findByIdAndUpdate(req.params.id, body, { new: true });
  if (!category) throw new AppError('Category not found', 404);
  res.json({ category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new AppError('Category not found', 404);
  res.json({ message: 'Category deleted' });
});
