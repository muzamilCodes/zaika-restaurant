import { Category } from '../models/Category.js';
import { GalleryItem } from '../models/GalleryItem.js';
import { Product } from '../models/Product.js';
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

const seedProducts = [
  {
    name: 'Kashmiri Mutton Rogan Josh',
    slug: 'rogan-josh',
    categoryName: 'Signature',
    price: 480,
    description: 'Slow-simmered tender mutton infused with Kashmiri red chillies, fennel, and aromatic spices.',
    images: ['https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=80'],
    isFeatured: true,
    isVeg: false,
    spiceLevel: 'medium'
  },
  {
    name: 'Royal Wazwan Rista',
    slug: 'rista',
    categoryName: 'Signature',
    price: 450,
    description: 'Delicate hand-pounded lamb meatballs cooked in a saffron-hued fiery red gravy.',
    images: ['https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80'],
    isFeatured: true,
    isVeg: false,
    spiceLevel: 'hot'
  },
  {
    name: 'Shahi Gushtaba',
    slug: 'gushtaba',
    categoryName: 'Chef Special',
    price: 490,
    description: 'The king of Wazwan: velvety lamb meatballs simmered in a rich, spiced yoghurt gravy.',
    images: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1000&q=80'],
    isFeatured: true,
    isVeg: false,
    spiceLevel: 'mild'
  },
  {
    name: 'Crispy Tabak Maaz',
    slug: 'tabak-maaz',
    categoryName: 'Chef Special',
    price: 420,
    description: 'Tender ribs poached in milk with aromatic spices, then pan-crisped in pure ghee.',
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80'],
    isFeatured: true,
    isVeg: false,
    spiceLevel: 'mild'
  },
  {
    name: 'Authentic Kashmiri Dum Aloo',
    slug: 'dum-aloo',
    categoryName: 'Vegetarian',
    price: 320,
    description: 'Golden baby potatoes slow-cooked in thick gravy of fennel, dry ginger, and Kashmiri spices.',
    images: ['https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=80'],
    isFeatured: true,
    isVeg: true,
    spiceLevel: 'medium'
  },
  {
    name: 'Saffron Almond Kahwa',
    slug: 'shahi-kahwa',
    categoryName: 'Dessert',
    price: 150,
    description: 'Traditional green tea infused with pure Kashmiri saffron strands, green cardamom, and crushed almonds.',
    images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80'],
    isFeatured: true,
    isVeg: true,
    spiceLevel: 'mild'
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

  for (const item of seedProducts) {
    const cat = categoryDocs.get(item.categoryName) || categoryDocs.values().next().value;
    await Product.findOneAndUpdate(
      { slug: item.slug },
      {
        ...item,
        category: cat._id,
        isAvailable: true,
        createdByAdmin: true
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  const productCount = await Product.countDocuments();

  console.log(`✅ Seed ready: ${categoryCount} categories, ${galleryCount} gallery items, ${productCount} products`);
}

