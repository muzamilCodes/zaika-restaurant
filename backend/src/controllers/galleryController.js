import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { GalleryItem } from '../models/GalleryItem.js';

const gallerySchema = z.object({
  title: z.string().min(2),
  imageUrl: z.string().url(),
  altText: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional()
});

export const listGalleryItems = asyncHandler(async (_req, res) => {
  const items = await GalleryItem.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  res.json({ items });
});

export const listAdminGalleryItems = asyncHandler(async (_req, res) => {
  const items = await GalleryItem.find().sort({ order: 1, createdAt: -1 });
  res.json({ items });
});

export const createGalleryItem = asyncHandler(async (req, res) => {
  const body = gallerySchema.parse({
    ...req.body,
    isActive: req.body.isActive === 'true' || req.body.isActive === true,
    order: req.body.order !== undefined && req.body.order !== '' ? Number(req.body.order) : 0
  });

  const item = await GalleryItem.create(body);
  res.status(201).json({ item });
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryItem.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError('Gallery item not found', 404);
  res.json({ message: 'Gallery item deleted' });
});
