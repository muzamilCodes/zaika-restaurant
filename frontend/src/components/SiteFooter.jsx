import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl sm:text-3xl">Zaika Restaurant</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-white/65 sm:mt-4">
            A premium Kashmiri dining and ordering experience from Handwara, Jammu & Kashmir.
          </p>
        </div>
        <div className="space-y-3 text-sm text-white/75 sm:space-y-4">
          <p className="flex items-start gap-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-gold" /> Handwara, Jammu & Kashmir, India
          </p>
          <p className="flex items-center gap-3">
            <Phone size={16} className="shrink-0 text-gold" /> +91 70000 00000
          </p>
          <p className="flex items-center gap-3">
            <Mail size={16} className="shrink-0 text-gold" /> hello@zaikarestaurant.in
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link className="rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/75 hover:bg-white/5" to="/about">
            About
          </Link>
          <Link className="rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/75 hover:bg-white/5" to="/menu">
            Menu
          </Link>
          <Link className="rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/75 hover:bg-white/5" to="/reservations">
            Reservations
          </Link>
          <a
            className="inline-flex items-center rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/75 hover:bg-white/5"
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={16} className="mr-2" />
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
