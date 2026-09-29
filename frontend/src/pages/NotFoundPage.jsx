import { Link } from 'react-router-dom';
import { Button, GlassCard } from '../components/ui.jsx';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
      <GlassCard className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">404</p>
        <h1 className="mt-3 font-display text-5xl">Page not found</h1>
        <Button asChild className="mt-6 bg-gold text-surface-900 hover:bg-[#efcf88]">
          <Link to="/">Go home</Link>
        </Button>
      </GlassCard>
    </div>
  );
}
