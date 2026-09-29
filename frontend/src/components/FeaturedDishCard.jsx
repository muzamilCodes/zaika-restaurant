import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Button, GlassCard } from './ui.jsx';

function getCategoryLabel(cat) {
  if (!cat) return 'Signature';
  if (typeof cat === 'string') return cat;
  if (typeof cat === 'object') {
    if (typeof cat.name === 'string') return cat.name;
    if (cat.name && typeof cat.name === 'object') {
      return cat.name.name || 'Signature';
    }
  }
  return 'Signature';
}

export function FeaturedDishCard({ dish }) {
  const image = dish.image || dish.images?.[0];
  const category = getCategoryLabel(dish.category);
  const detailPath = `/food/${dish.slug || dish.id || dish._id}`;

  return (
    <GlassCard className="group flex h-full flex-col overflow-hidden p-0">
      <Link to={detailPath} className="relative block aspect-[4/3] overflow-hidden sm:aspect-[5/4]">
        <img
          src={image}
          alt={dish.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect fill='%231a1510' width='100%' height='100%'/><text x='50%' y='50%' fill='%23d7b46a' font-size='28' text-anchor='middle' dominant-baseline='middle'>Zaika</text></svg>";
          }}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-gold backdrop-blur sm:left-4 sm:top-4 sm:text-xs">
          {category}
        </span>
        {dish.badge ? (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-surface-900 shadow sm:right-4 sm:top-4">
            {dish.badge}
          </span>
        ) : null}
        <p className="absolute bottom-3 right-3 rounded-full bg-gold px-3 py-1.5 text-sm font-semibold text-surface-900 sm:bottom-4 sm:right-4">
          Rs. {dish.price}
        </p>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="flex-1">
          <h3 className="font-display text-2xl leading-tight text-white sm:text-[1.75rem]">{dish.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">
            {dish.description?.trim() || 'A signature plate from our Handwara kitchen.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button asChild className="w-full bg-gold text-surface-900 hover:bg-[#efcf88]">
            <Link to="/menu">Order now</Link>
          </Button>
          <Button asChild className="w-full border border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Link to="/reservations">Book table</Link>
          </Button>
        </div>

        <Link
          to={detailPath}
          className="inline-flex items-center gap-1 text-sm text-white/55 transition hover:text-gold"
        >
          View details <ArrowUpRight size={14} />
        </Link>
      </div>
    </GlassCard>
  );
}

export function FeaturedDishesSection({
  dishes,
  eyebrow = 'Featured dishes',
  title = 'Royal dishes from our kitchen',
  description = 'Signature plates curated by our kitchen — discover the flavors guests return for.',
  showViewMenu = true
}) {
  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-gold sm:mb-3 sm:text-xs sm:tracking-[0.35em]">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/70 sm:mt-4 md:text-base">{description}</p>
        </div>
        {showViewMenu ? (
          <Button asChild className="w-full shrink-0 border border-white/10 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
            <Link to="/menu">Full menu</Link>
          </Button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {dishes.length ? (
          dishes.map((dish) => <FeaturedDishCard key={dish._id || dish.id} dish={dish} />)
        ) : (
          <GlassCard className="md:col-span-2 xl:col-span-3">
            No featured dishes added by admin yet.
          </GlassCard>
        )}
      </div>
    </section>
  );
}
