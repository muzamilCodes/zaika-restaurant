import { Category } from '../models/Category.js';
import { GalleryItem } from '../models/GalleryItem.js';
import { makeSlug } from '../utils/slug.js';

const seedCategories = [
  { name: 'Signature', description: 'House special plates', order: 1 },
  { name: 'Chef Special', description: 'Recommended by our chef', order: 2 },
  { name: 'Vegetarian', description: 'Fresh vegetarian favourites', order: 3 },
  { name: 'Seafood', description: 'Premium seafood selections', order: 4 },
  { name: 'Dessert', description: 'Sweet finishing touches', order: 5 }
];

const seedGalleryItems = [
  {
    title: 'Dining Hall Ambience',
    imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80',
    altText: 'Elegant restaurant dining hall',
    order: 1
  },
  {
    title: 'Signature Plating',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    altText: 'Premium plated dish',
    order: 2
  },
  {
    title: 'Chef Preparation',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    altText: 'Chef preparing food',
    order: 3
  },
  {
    title: 'Dessert Showcase',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    altText: 'Dessert and table setting',
    order: 4
  }
];

export async function seedDatabase() {
  const categoryDocs = new Map();

  for (const categorySeed of seedCategories) {
    const category = await Category.findOneAndUpdate(
      { name: categorySeed.name },
      {
        ...categorySeed,
        slug: makeSlug(categorySeed.name),
        isActive: true
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    categoryDocs.set(category.name, category);
  }
  const categoryCount = await Category.countDocuments();
  for (const gallerySeed of seedGalleryItems) {
    await GalleryItem.findOneAndUpdate(
      { title: gallerySeed.title },
      { ...gallerySeed, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const galleryCount = await GalleryItem.countDocuments();
  console.log(`✅ Seed ready: ${categoryCount} categories, ${galleryCount} gallery items`);
}
