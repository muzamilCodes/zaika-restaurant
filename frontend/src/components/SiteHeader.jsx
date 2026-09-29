import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Crown, UserRound } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { Button } from './ui.jsx';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/menu', label: 'Menu' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const cartCount = useCartStore((state) => state.itemCount());
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-surface-900/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold shadow-glow sm:h-11 sm:w-11">
            <Crown size={18} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-xl leading-none sm:text-2xl">Zaika</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/50 sm:text-[11px] sm:tracking-[0.35em]">
              Restaurant
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm transition ${isActive ? 'text-gold' : 'text-white/70 hover:text-white'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/cart"
            aria-label={`Cart with ${cartCount} items`}
            className="relative grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 sm:h-11 sm:w-11 lg:hidden"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-surface-900">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            ) : null}
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <Button asChild className="border border-gold/30 bg-gold/10 text-gold hover:bg-gold/20">
              <Link to="/cart">
                <ShoppingBag size={16} className="mr-2" />
                Cart ({cartCount})
              </Link>
            </Button>
            <Button asChild className="bg-gold text-surface-900 hover:bg-[#efcf88]">
              <Link to="/reservations">Book now</Link>
            </Button>
            <Button asChild className="border border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Link to={user ? '/profile' : '/login'}>{user ? 'Profile' : 'Login'}</Link>
            </Button>
          </div>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white lg:hidden sm:h-11 sm:w-11"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-black/55 backdrop-blur-sm sm:top-20 lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full z-50 border-b border-white/10 bg-surface-900/98 px-4 py-4 shadow-glass lg:hidden"
            >
              <div className="mx-auto flex max-w-7xl flex-col gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-2xl px-4 py-3.5 text-base transition ${
                        isActive ? 'bg-gold/15 text-gold' : 'text-white/80 hover:bg-white/5'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}

                <div className="mt-2 grid gap-2 border-t border-white/10 pt-4">
                  <Button asChild className="w-full bg-gold text-surface-900 hover:bg-[#efcf88]">
                    <Link to="/reservations" onClick={() => setOpen(false)}>
                      Book a table
                    </Link>
                  </Button>
                  <Button asChild className="w-full border border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <Link to={user ? '/profile' : '/login'} onClick={() => setOpen(false)}>
                      <UserRound size={16} className="mr-2" />
                      {user ? 'My profile' : 'Login / Register'}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
