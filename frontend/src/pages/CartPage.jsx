import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Seo } from '../components/Seo.jsx';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { useCartStore } from '../store/useCartStore.js';

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateItem = useCartStore((state) => state.updateItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.subtotal());
  const tax = useCartStore((state) => state.tax());
  const deliveryFee = useCartStore((state) => state.deliveryFee());
  const total = useCartStore((state) => state.total());

  return (
    <>
      <Seo title="Cart" description="Review your Zaika Restaurant cart and continue to checkout." />
      <SectionHeading eyebrow="Cart" title="Your selected dishes" />
      <div className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-[1fr_360px] lg:gap-8">
        <div className="space-y-3 sm:space-y-4">
          {items.length ? (
            items.map((item) => (
              <GlassCard key={item.id} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                <img src={item.image} alt={item.name} className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-24" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-xl sm:text-2xl">{item.name}</p>
                      <p className="mt-1 text-sm text-white/65 sm:mt-2">Rs. {item.price}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.id)}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/50 hover:bg-white/5 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-3 sm:mt-4">
                    <button type="button" onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5">
                      <Minus size={16} />
                    </button>
                    <span className="min-w-6 text-center">{item.quantity}</span>
                    <button type="button" onClick={() => updateItem(item.id, item.quantity + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <GlassCard>
              <p>Your cart is empty.</p>
              <Button asChild className="mt-4 w-full bg-gold text-surface-900 hover:bg-[#efcf88] sm:w-auto">
                <Link to="/menu">Browse menu</Link>
              </Button>
            </GlassCard>
          )}
        </div>

        <GlassCard className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow="Summary" title="Price breakdown" />
          <div className="space-y-3 text-sm text-white/75">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>Rs. {tax}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>Rs. {deliveryFee}</span></div>
            <div className="border-t border-white/10 pt-3 text-base font-semibold text-white">
              <div className="flex justify-between"><span>Total</span><span>Rs. {total}</span></div>
            </div>
          </div>
          <Button asChild className="w-full bg-gold text-surface-900 hover:bg-[#efcf88]">
            <Link to="/checkout">Proceed to checkout</Link>
          </Button>
        </GlassCard>
      </div>
    </>
  );
}
