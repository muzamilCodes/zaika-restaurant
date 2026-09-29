import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from './ui.jsx';
import { heroSlides } from '../data/mockData.js';

const AUTO_MS = 5000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = heroSlides[index];
  const total = heroSlides.length;

  const goTo = (next) => setIndex(((next % total) + total) % total);

  useEffect(() => {
    if (paused || total <= 1) return undefined;
    const timer = setInterval(() => setIndex((c) => (c + 1) % total), AUTO_MS);
    return () => clearInterval(timer);
  }, [paused, total, index]);

  return (
    <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold sm:mb-4 sm:px-4 sm:text-xs">
          <Sparkles size={13} />
          Premium Kashmiri Cuisine
        </p>

        <h1 className="font-display text-[2.7rem] leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Zaika Restaurant
        </h1>
        <p className="mt-3 max-w-xl font-display text-xl leading-snug text-white/90 sm:mt-4 sm:text-2xl md:text-3xl">
          {slide.headline}
        </p>
        <p className="mt-4 max-w-lg text-sm leading-7 text-white/65 sm:text-base sm:leading-8">{slide.text}</p>

        <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
          <Button asChild className="w-full bg-gold text-surface-900 hover:bg-[#efcf88] sm:w-auto">
            <Link to="/menu">
              Explore Menu <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
          <Button asChild className="w-full border border-white/15 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
            <Link to="/reservations">Book a Table</Link>
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-2 sm:mt-8">
          {heroSlides.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-gold' : 'w-2.5 bg-white/30'}`}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-gold/20 via-transparent to-ember/15 blur-2xl" />
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-glass sm:rounded-[2rem]">
          <AnimatePresence mode="wait">
            <motion.img
              key={slide.id}
              src={slide.image}
              alt={slide.alt}
              initial={{ opacity: 0.45 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="h-[280px] w-full object-cover sm:h-[400px] lg:h-[500px]"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1400' height='900'><rect fill='%16120e' width='100%' height='100%'/></svg>";
              }}
            />
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
              {index + 1} / {total}
            </p>
            <p className="mt-1 font-display text-xl text-white sm:text-2xl">{slide.headline}</p>
          </div>
          <div className="absolute right-3 top-3 flex gap-2 sm:right-4 sm:top-4">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => goTo(index - 1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => goTo(index + 1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
