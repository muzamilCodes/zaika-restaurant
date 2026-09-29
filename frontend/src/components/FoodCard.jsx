import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button, GlassCard } from './ui.jsx';

export function FoodCard({ product, onAdd }) {
  const image = product.images?.[0] || product.image;
  const price = product.discountedPrice || product.price;

  function getCategoryLabel(cat) {
    if (!cat) return 'Zaika';
    if (typeof cat === 'string') return cat;
    if (typeof cat === 'object') {
      if (typeof cat.name === 'string') return cat.name;
      if (cat.name && typeof cat.name === 'object') {
        return cat.name.name || 'Zaika';
      }
    }
    return 'Zaika';
  }

  return (
    <GlassCard className="group flex h-full flex-col overflow-hidden p-0">
      <motion.div whileHover={{ y: -3 }} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect fill='%231a1510' width='100%' height='100%'/><text x='50%' y='50%' fill='%23d7b46a' font-size='24' text-anchor='middle' dominant-baseline='middle'>Image</text></svg>";
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur sm:left-4 sm:top-4 sm:text-xs">
            {getCategoryLabel(product.category)}
          </div>
          <p className="absolute bottom-3 right-3 rounded-full bg-gold px-3 py-1.5 text-sm font-semibold text-surface-900">
            Rs. {price}
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
          <div className="flex-1">
            <h3 className="font-display text-xl leading-tight text-white sm:text-2xl">{product.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">{product.description}</p>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Button asChild className="border border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Link to={`/food/${product.slug || product.id || product._id}`}>View dish</Link>
            </Button>
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={() => onAdd?.(product)}
              className="grid h-11 w-11 place-items-center rounded-full bg-gold text-surface-900 transition hover:bg-[#efcf88]"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </GlassCard>
  );
}
