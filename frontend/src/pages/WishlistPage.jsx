import { useAuthStore } from '../store/useAuthStore.js';
import { GlassCard, SectionHeading } from '../components/ui.jsx';
import { Seo } from '../components/Seo.jsx';
import { Link } from 'react-router-dom';

export function WishlistPage() {
  const user = useAuthStore((state) => state.user);
  const wishlist = user?.wishlist || [];

  return (
    <>
      <Seo title="Wishlist" description="Your saved dishes at Zaika Restaurant." />
      <SectionHeading eyebrow="Wishlist" title="Your favorite dishes" />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {wishlist.length ? (
          wishlist.map((item) => (
            <GlassCard key={item._id}>
              <p className="font-display text-2xl">{item.name}</p>
              <Link to={`/food/${item.slug || item._id}`} className="mt-3 inline-block text-gold">
                View dish
              </Link>
            </GlassCard>
          ))
        ) : (
          <GlassCard>No items in wishlist.</GlassCard>
        )}
      </div>
    </>
  );
}
