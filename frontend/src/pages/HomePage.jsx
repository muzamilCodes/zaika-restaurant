import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  CalendarDays, 
  MessageCircle,
  UtensilsCrossed 
} from 'lucide-react';
import { Seo } from '../components/Seo.jsx';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { HeroSlider } from '../components/HeroSlider.jsx';
import { FeaturedDishCard } from '../components/FeaturedDishCard.jsx';
import { heroHighlights, popularDishes, testimonials, restaurantInfo } from '../data/mockData.js';
import { galleryService } from '../services/galleryService.js';
import { productService } from '../services/productService.js';

export function HomePage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    let mounted = true;

    productService
      .getProducts({ featured: true })
      .then((response) => {
        if (!mounted) return;
        const products = response.data?.products || [];
        setFeaturedProducts(products.length > 0 ? products.slice(0, 6) : []);
      })
      .catch(() => {
        if (mounted) setFeaturedProducts([]);
      });

    galleryService
      .getGalleryItems()
      .then((response) => {
        if (!mounted) return;
        setGalleryItems((response.data?.items || []).slice(0, 4));
      })
      .catch(() => {
        if (mounted) setGalleryItems([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Use API featured products if available, otherwise gracefully fallback to curated popular dishes
  const displayDishes = featuredProducts.length > 0 ? featuredProducts : popularDishes;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    'Zaika Restaurant, Handwara, Jammu & Kashmir, India'
  )}`;

  return (
    <>
      <Seo
        title="Zaika Restaurant Handwara | Authentic Kashmiri Wazwan & Dining"
        description="Experience authentic Kashmiri Wazwan, royal delicacies, and fine dining at Zaika Restaurant in Handwara. Order online or reserve your table today."
      />

      {/* SECTION 1: HERO SECTION */}
      <section aria-label="Hero Section">
        <HeroSlider />

        {/* Highlights banner */}
        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3">
          {heroHighlights.map((item) => (
            <GlassCard key={item} className="flex items-center gap-3 p-4 text-sm text-white/80">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                <Sparkles size={14} />
              </span>
              <span>{item}</span>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* SECTION 2: POPULAR DISHES / MENU PREVIEW */}
      <section className="mt-16 sm:mt-20 md:mt-24" aria-label="Popular Dishes">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Popular Dishes"
            title="Signature tastes of Kashmir"
            description="Prepared slow and served warm. Choose from our most requested Wazwan specialties and signature plates."
          />
          <Button asChild className="w-full shrink-0 border border-white/10 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
            <Link to="/menu">
              Full menu <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>

        {/* Simple cards + easy scan + clear prices (wireframe match) */}
        <div className="mt-7 grid gap-4 sm:mt-8 md:grid-cols-2 xl:grid-cols-3">
          {displayDishes.map((dish) => (
            <FeaturedDishCard key={dish._id || dish.id} dish={dish} />
          ))}
        </div>
      </section>

      {/* SECTION 3: REVIEWS / SOCIAL PROOF */}
      <section className="mt-16 sm:mt-20 md:mt-24" aria-label="Customer Reviews">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold sm:text-xs">
            Guest Experiences
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            Loved by diners across Handwara
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Genuine feedback from families, food lovers, and travelers who dine with us.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <GlassCard key={idx} className="flex flex-col justify-between p-6">
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-white/50">{item.role}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[11px] text-gold">
                  <CheckCircle2 size={12} />
                  {item.tag || 'Verified Diner'}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* SECTION 4: LOCATION + OPENING HOURS */}
      <section className="mt-16 sm:mt-20 md:mt-24" aria-label="Location and Hours">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Visit & Connect"
            title="Location & Opening Hours"
            description="Conveniently situated in the heart of Handwara. Stop by for fine dining or pick up your favorites."
          />
        </div>

        <div className="mt-7 grid gap-4 sm:mt-8 md:grid-cols-3">
          {/* Card 1: Opening Hours */}
          <GlassCard className="flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
                  <Clock size={20} />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Open Daily
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-white">Opening Hours</h3>
              <div className="mt-4 space-y-3 text-sm">
                {restaurantInfo.hours.map((h, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-2 text-white/70">
                    <span>{h.days}</span>
                    <span className="font-medium text-white">{h.timing}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-6 text-xs text-white/45">Kitchen closes 30 mins before closing time.</p>
          </GlassCard>

          {/* Card 2: Address & Directions */}
          <GlassCard className="flex flex-col justify-between p-6">
            <div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
                <MapPin size={20} />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-white">Our Address</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                {restaurantInfo.address}
              </p>
              <p className="mt-2 text-xs text-gold/80">
                Handwara, Jammu & Kashmir, India
              </p>
            </div>

            <div className="mt-6">
              <Button asChild className="w-full border border-white/15 bg-white/10 text-white hover:bg-white/20">
                <a href={directionsUrl} target="_blank" rel="noreferrer">
                  Get Directions <ArrowRight size={14} className="ml-1.5" />
                </a>
              </Button>
            </div>
          </GlassCard>

          {/* Card 3: Phone & WhatsApp */}
          <GlassCard className="flex flex-col justify-between p-6">
            <div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
                <Phone size={20} />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-white">Contact & Bookings</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                For table reservations, party bookings, or home delivery inquiries:
              </p>
              <div className="mt-3">
                <a
                  href={`tel:${restaurantInfo.phone}`}
                  className="font-display text-xl text-gold hover:underline"
                >
                  {restaurantInfo.phone}
                </a>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Button asChild className="w-full bg-gold text-surface-900 hover:bg-[#efcf88]">
                <a href={`tel:${restaurantInfo.phone}`}>
                  <Phone size={14} className="mr-2" /> Call Now
                </a>
              </Button>
              <Button asChild className="w-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20">
                <a 
                  href={`https://wa.me/${restaurantInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Zaika%20Restaurant,%20I%20would%20like%20to%20inquire%20about%20a%20table/order.`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={14} className="mr-2" /> WhatsApp Us
                </a>
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* SECTION 5: FINAL BOOKING / ORDER CTA */}
      <section className="mt-16 rounded-[1.75rem] border border-gold/25 bg-gradient-to-br from-gold/20 via-surface-800 to-surface-900 p-6 sm:mt-20 sm:rounded-[2rem] sm:p-10 md:mt-24 md:p-14" aria-label="Book or Order CTA">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-xs">
              <UtensilsCrossed size={12} />
              Ready for an unforgettable meal?
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              Reserve your table or order online tonight.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              Experience the royal warmth of authentic Kashmiri cuisine in Handwara. Fast delivery to your doorstep and elegant seating for you and your family.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button asChild className="w-full bg-gold text-surface-900 hover:bg-[#efcf88] sm:w-auto">
              <Link to="/reservations" className="inline-flex items-center justify-center">
                <CalendarDays size={16} className="mr-2" /> Book a Table
              </Link>
            </Button>
            <Button asChild className="w-full border border-white/20 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
              <Link to="/menu" className="inline-flex items-center justify-center">
                Order Online <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

