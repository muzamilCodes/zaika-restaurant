import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, Star } from 'lucide-react';
import { Seo } from '../components/Seo.jsx';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { productService } from '../services/productService.js';
import { useCartStore } from '../store/useCartStore.js';

import { popularDishes } from '../data/mockData.js';

export function FoodDetailsPage() {
  const { identifier } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    productService
      .getProducts()
      .then((response) => {
        const products = response.data?.products || [];
        const allDishes = products.length > 0 ? products : popularDishes;
        const match =
          allDishes.find(
            (item) =>
              item._id === identifier ||
              item.slug === identifier ||
              item.id === identifier
          ) ||
          popularDishes.find(
            (item) =>
              item._id === identifier ||
              item.slug === identifier ||
              item.id === identifier
          );

        if (match) {
          setProduct({
            ...match,
            images: match.images || [match.image],
            category:
              typeof match.category === 'object'
                ? match.category
                : { name: match.category || 'Special' }
          });
          const relatedItems = (products.length > 0 ? products : popularDishes)
            .filter((item) => (item._id || item.id) !== (match._id || match.id))
            .slice(0, 4);
          setRelated(relatedItems);
        }
      })
      .catch(() => {
        const match = popularDishes.find(
          (item) =>
            item._id === identifier ||
            item.slug === identifier ||
            item.id === identifier
        );
        if (match) {
          setProduct({
            ...match,
            images: match.images || [match.image],
            category:
              typeof match.category === 'object'
                ? match.category
                : { name: match.category || 'Special' }
          });
          setRelated(popularDishes.filter((item) => item.id !== match.id).slice(0, 4));
        }
      });
  }, [identifier]);

  if (!product) {
    return <GlassCard>Dish not found.</GlassCard>;
  }

  const price = product.discountedPrice || product.price;

  return (
    <>
      <Seo title={product.name} description={product.description} />
      <SectionHeading eyebrow="Food details" title={product.name} description={product.description} />
      <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <GlassCard className="overflow-hidden p-0">
          <img src={product.images[0]} alt={product.name} className="h-[280px] w-full object-cover sm:h-[400px] lg:h-[520px]" />
        </GlassCard>
        <GlassCard className="space-y-5 sm:space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">{product.category?.name}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">{product.name}</h2>
            <div className="mt-3 flex items-center gap-2 text-sm text-white/70 sm:mt-4">
              <Star className="fill-gold text-gold" size={16} />
              {product.rating || 4.8} | {product.reviewCount || 120} reviews
            </div>
          </div>
          <p className="text-sm leading-7 text-white/70 sm:leading-8">{product.description}</p>
          <p className="text-2xl font-semibold text-gold sm:text-3xl">Rs. {price}</p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5">
              <Minus size={16} />
            </button>
            <span className="min-w-12 text-center text-lg">{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => value + 1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5">
              <Plus size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:gap-4">
            <Button onClick={() => addItem(product, quantity)} className="w-full bg-gold text-surface-900 hover:bg-[#efcf88] sm:w-auto">
              Add to cart
            </Button>
            <Button asChild className="w-full border border-white/10 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
              <Link to="/cart">Go to cart</Link>
            </Button>
          </div>
        </GlassCard>
      </div>

      <section className="mt-16 sm:mt-20 md:mt-24">
        <SectionHeading eyebrow="Related products" title="You may also like" />
        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => (
            <GlassCard key={item._id}>
              <p className="font-semibold text-white">{item.name}</p>
              <p className="mt-2 text-sm text-white/65">Rs. {item.discountedPrice || item.price}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </>
  );
}
