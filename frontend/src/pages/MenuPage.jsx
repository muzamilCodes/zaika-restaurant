import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { FoodCard } from '../components/FoodCard.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { productService } from '../services/productService.js';
import { useCartStore } from '../store/useCartStore.js';

import { popularDishes } from '../data/mockData.js';

export function MenuPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    Promise.allSettled([productService.getCategories(), productService.getProducts()])
      .then(([catResult, productResult]) => {
        if (catResult.status === 'fulfilled') {
          setCategories(catResult.value.data?.categories || []);
        }

        if (productResult.status === 'fulfilled') {
          const fetched = productResult.value?.data?.products || [];
          setProducts(fetched.length > 0 ? fetched : popularDishes);
        } else {
          setProducts(popularDishes);
        }
      })
      .catch(() => setProducts(popularDishes))
      .finally(() => setLoading(false));
  }, []);

  const visibleProducts = useMemo(() => {
    const list = products.length > 0 ? products : popularDishes;
    return list.filter((product) => {
      const catName = typeof product.category === 'object' ? product.category?.name : product.category;
      const matchesCategory =
        category === 'all' || product.category?._id === category || catName === category;
      const matchesQuery = `${product.name} ${product.description || ''}`.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, category, debouncedQuery]);

  return (
    <>
      <Seo title="Menu" description="Browse premium Kashmiri dishes and add them to your cart." />
      <SectionHeading
        eyebrow="Menu"
        title="Explore our curated menu"
        description="Search dishes, filter by category, and place your order with a luxury dining feel."
      />

      <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search dishes..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-white/30"
        />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <button type="button" onClick={() => setCategory('all')} className={`shrink-0 rounded-full px-4 py-2.5 text-sm ${category === 'all' ? 'bg-gold text-surface-900' : 'bg-white/5 text-white/70'}`}>
            All
          </button>
          {categories.map((item) => (
            <button
              type="button"
              key={item._id}
              onClick={() => setCategory(item._id)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm ${category === item._id ? 'bg-gold text-surface-900' : 'bg-white/5 text-white/70'}`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <GlassCard className="md:col-span-2 xl:col-span-3">Loading menu...</GlassCard>
        ) : visibleProducts.length ? (
          visibleProducts.map((product) => (
            <FoodCard key={product._id || product.id} product={product} onAdd={(item) => addItem(item, 1)} />
          ))
        ) : (
          <GlassCard className="md:col-span-2 xl:col-span-3">No admin-added dishes found.</GlassCard>
        )}
      </div>
      <div className="mt-10 flex justify-center">
        <Button asChild className="bg-gold text-surface-900 hover:bg-[#efcf88]">
          <Link to="/cart">View cart</Link>
        </Button>
      </div>
    </>
  );
}
