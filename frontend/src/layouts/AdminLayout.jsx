import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  CalendarCheck2,
  Tag,
  LogOut,
  Grid2X2,
  Ticket,
  MessageSquareText,
  Menu,
  X,
  Images
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore.js';
import { Button } from '../components/ui.jsx';
import { authService } from '../services/authService.js';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Menu', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: Grid2X2 },
  { to: '/admin/orders', label: 'Orders', icon: Tag },
  { to: '/admin/reservations', label: 'Reservations', icon: CalendarCheck2 },
  { to: '/admin/contacts', label: 'Messages', icon: MessageSquareText },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/customers', label: 'Customers', icon: Users }
];

function AdminNav({ onNavigate, onLogout }) {
  return (
    <>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">Zaika Admin</p>
        <h1 className="mt-2 font-display text-3xl">Command Center</h1>
      </div>
      <nav className="space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              end={link.end}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                  isActive ? 'bg-gold/15 text-gold' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <Button
        type="button"
        onClick={onLogout}
        className="mt-6 w-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
      >
        <LogOut size={16} className="mr-2" />
        Sign out
      </Button>
    </>
  );
}

export function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout errors and clear local state anyway
    }
    clearAuth();
    navigate('/login', { replace: true });
  };

  const currentLabel =
    links.find((link) =>
      link.end ? location.pathname === link.to : location.pathname.startsWith(link.to)
    )?.label || 'Admin';

  return (
    <div className="min-h-screen bg-surface-900 text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-surface-900/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Zaika Admin</p>
            <p className="truncate font-display text-xl">{currentLabel}</p>
          </div>
          <button
            type="button"
            aria-label={menuOpen ? 'Close admin menu' : 'Open admin menu'}
            onClick={() => setMenuOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close admin menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-[min(88vw,320px)] overflow-y-auto border-r border-white/10 bg-surface-900 p-5 shadow-glass lg:hidden"
            >
              <AdminNav onNavigate={() => setMenuOpen(false)} onLogout={handleLogout} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-xl lg:block">
          <AdminNav onLogout={handleLogout} />
        </aside>
        <section className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-xl sm:p-5 md:p-6">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
