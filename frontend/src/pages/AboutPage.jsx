import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, MapPinned, Clock3, Heart } from 'lucide-react';
import { Seo } from '../components/Seo.jsx';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { FeaturedDishesSection } from '../components/FeaturedDishCard.jsx';
import { stats, testimonials } from '../data/mockData.js';
import { InfoCard } from '../components/InfoCard.jsx';
import { productService } from '../services/productService.js';

export function AboutPage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    let mounted = true;

    productService
      .getProducts({ featured: true })
      .then((response) => {
        const products = response.data?.products || [];
        if (!mounted) return;
        setFeaturedProducts(products.slice(0, 6));
      })
      .catch(() => {
        if (mounted) setFeaturedProducts([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Seo
        title="About Zaika Restaurant"
        description="Learn about Zaika Restaurant in Handwara — our story, signature dishes, hospitality, and the guests who love dining with us."
      />

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <SectionHeading
            eyebrow="About Zaika"
            title="A Handwara kitchen rooted in Kashmiri hospitality"
            description="Zaika Restaurant brings refined Kashmiri flavors, warm service, and modern ordering together in one dining destination."
          />
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
            <p>
              From family tables to quick delivery, every plate is prepared with care — balancing tradition,
              presentation, and the comfort guests expect from a local favorite.
            </p>
            <p>
              Whether you are booking a table or ordering online, Zaika is built to feel premium, simple, and
              unmistakably from Handwara.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button asChild className="w-full bg-gold text-surface-900 hover:bg-[#efcf88] sm:w-auto">
              <Link to="/menu">Explore menu</Link>
            </Button>
            <Button asChild className="w-full border border-white/10 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
              <Link to="/reservations">Book a table</Link>
            </Button>
          </div>
        </motion.div>

        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 shadow-glass sm:rounded-[2rem]">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80"
            alt="Zaika dining room"
            loading="lazy"
            className="h-[260px] w-full object-cover sm:h-[360px] lg:h-[420px]"
          />
          <div className="space-y-3 border-t border-white/10 bg-white/[0.04] p-4 sm:p-6">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold">
              <Heart size={14} /> Our promise
            </p>
            <p className="font-display text-2xl text-white sm:text-3xl">Flavor first. Guests always.</p>
          </div>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 md:mt-20 md:grid-cols-4">
        {stats.map((stat) => (
          <InfoCard key={stat.label} title={stat.label} value={stat.value} />
        ))}
      </section>

      <div className="mt-16 sm:mt-20 md:mt-24">
        <FeaturedDishesSection
          dishes={featuredProducts}
          description="The same signature plates guests love on our home page — curated by our kitchen."
        />
      </div>

      <section className="mt-16 grid gap-8 sm:mt-20 lg:mt-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Why choose us"
            title="Built for memorable hospitality"
            description="Luxury visuals, quick ordering, secure payments, and customer-first support in one elegant platform."
          />
          <div className="mt-6 space-y-3 sm:space-y-4">
            {[
              ['Fine dining visuals', 'Dark luxury palette with cinematic food presentation.'],
              ['Fast ordering', 'Mobile-first experience with smooth checkout and tracking.'],
              ['Reservation ready', 'Table booking flow for families and events.']
            ].map(([title, desc]) => (
              <GlassCard key={title} className="p-4 sm:p-5">
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-7 text-white/65">{desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <GlassCard className="space-y-3 sm:space-y-4">
            <UtensilsCrossed className="text-gold" />
            <p className="font-display text-2xl sm:text-3xl">Chef led menu</p>
            <p className="text-sm leading-7 text-white/65">
              Thoughtful Kashmiri and Indian dishes presented with premium styling.
            </p>
          </GlassCard>
          <GlassCard className="space-y-3 sm:space-y-4">
            <MapPinned className="text-gold" />
            <p className="font-display text-2xl sm:text-3xl">Handwara presence</p>
            <p className="text-sm leading-7 text-white/65">
              Built for local delivery, dining, and easy directions on Google Maps.
            </p>
          </GlassCard>
          <GlassCard className="space-y-3 sm:col-span-2 sm:space-y-4">
            <Clock3 className="text-gold" />
            <p className="font-display text-2xl sm:text-3xl">Always responsive</p>
            <p className="text-sm leading-7 text-white/65">
              Fast, lightweight, and polished across every screen size.
            </p>
          </GlassCard>
        </div>
      </section>

      <section className="mt-16 sm:mt-20 md:mt-24">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by guests across Handwara"
          description="A restaurant experience that feels as premium online as it does in person."
        />
        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <GlassCard key={item.name}>
              <p className="text-base leading-7 text-white/80 sm:text-lg sm:leading-8">“{item.text}”</p>
              <p className="mt-5 text-xs uppercase tracking-[0.3em] text-gold sm:mt-6 sm:text-sm">
                {item.name}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>
    </>
  );
}
