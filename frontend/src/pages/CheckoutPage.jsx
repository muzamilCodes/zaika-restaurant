import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Truck } from 'lucide-react';
import { Seo } from '../components/Seo.jsx';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import Toast from '../components/Toast.jsx';
import { FormField, FormTextArea } from '../components/FormField.jsx';
import { useCartStore } from '../store/useCartStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { orderService } from '../services/orderService.js';

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  addressLine1: z.string().min(3),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pinCode: z.string().min(4),
  landmark: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(['cod', 'razorpay']),
  couponCode: z.string().optional()
});

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'cod' }
  });

  const cartCount = useMemo(() => items.reduce((count, item) => count + item.quantity, 0), [items]);

  useEffect(() => {
    if (user) {
      setValue('fullName', user.name || '');
      setValue('phone', user.phone || '');
    }
  }, [user, setValue]);

  const onSubmit = async (values) => {
    if (!items.length) {
      setMessage('Your cart is empty.');
      return;
    }

    const payload = {
      shippingAddress: {
        fullName: values.fullName,
        phone: values.phone,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        pinCode: values.pinCode,
        landmark: values.landmark
      },
      paymentMethod: values.paymentMethod,
      couponCode: values.couponCode,
      notes: values.notes
    };
    // include cart items from local store so server can create the order if server-side cart is empty
    if (items && items.length) {
      payload.items = items.map((it) => ({ product: it.id, quantity: it.quantity }));
    }

    try {
      setLoading(true);
      const response = await orderService.createOrder(payload);
      if (response.data?.order?.orderNumber) {
        localStorage.setItem('zaika-last-order-number', response.data.order.orderNumber);
      }

      if (values.paymentMethod === 'razorpay' && response.data.razorpayOrder) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setMessage('Razorpay failed to load.');
          return;
        }

        const options = {
          key: response.data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: response.data.razorpayOrder.amount,
          currency: response.data.razorpayOrder.currency,
          name: 'Zaika Restaurant',
          description: 'Food order payment',
          order_id: response.data.razorpayOrder.id,
          handler: async function (paymentResponse) {
            await orderService.verifyPayment({
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature
            });
            clearCart();
            navigate('/orders');
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        return;
      }

      clearCart();
      setToast({
        message: `Order placed successfully. Order No: ${response.data.order?.orderNumber || 'pending'}`,
        type: 'success'
      });
      navigate('/orders', { state: { highlightOrderNumber: response.data.order?.orderNumber } });
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Order failed.';
      setToast({ message: msg, type: 'error' });
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Checkout" description="Secure checkout for your Zaika Restaurant order." />
      <SectionHeading eyebrow="Checkout" title="Complete your order" />
      <div className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-[1fr_360px] lg:gap-8">
        <GlassCard>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Full name" {...register('fullName')} />
            <FormField label="Phone number" {...register('phone')} />
            <FormField label="Address line 1" className="md:col-span-2" {...register('addressLine1')} />
            <FormField label="Address line 2" className="md:col-span-2" {...register('addressLine2')} />
            <FormField label="City" {...register('city')} />
            <FormField label="State" {...register('state')} />
            <FormField label="PIN Code" {...register('pinCode')} />
            <FormField label="Landmark" {...register('landmark')} />
            <FormField label="Coupon code" {...register('couponCode')} />
            <div className="md:col-span-2 space-y-2">
              <span className="text-sm text-white/75">Payment method</span>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-gold/40 hover:bg-white/10">
                  <input type="radio" value="cod" className="sr-only peer" {...register('paymentMethod')} />
                  <div className="flex items-start gap-3 rounded-2xl border border-transparent p-1 transition peer-checked:border-gold/50 peer-checked:bg-gold/10">
                    <Truck className="mt-0.5 text-gold" size={18} />
                    <div>
                      <p className="font-semibold text-white">Cash on Delivery</p>
                      <p className="mt-1 text-sm text-white/60">Pay when the order arrives at your door.</p>
                    </div>
                  </div>
                </label>
                <label className="cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-gold/40 hover:bg-white/10">
                  <input type="radio" value="razorpay" className="sr-only peer" {...register('paymentMethod')} />
                  <div className="flex items-start gap-3 rounded-2xl border border-transparent p-1 transition peer-checked:border-gold/50 peer-checked:bg-gold/10">
                    <CreditCard className="mt-0.5 text-gold" size={18} />
                    <div>
                      <p className="font-semibold text-white">Online Payment</p>
                      <p className="mt-1 text-sm text-white/60">Pay securely with card, UPI, or wallet.</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            <FormTextArea label="Order notes" className="md:col-span-2" {...register('notes')} />
            <div className="md:col-span-2">
              <Button type="submit" className="w-full bg-gold text-surface-900 hover:bg-[#efcf88] sm:w-auto" disabled={loading}>
                Place order
              </Button>
            </div>
          </form>
          {message ? <p className="mt-4 text-sm text-gold">{message}</p> : null}
          {loading ? <p className="mt-4 text-sm text-white/60">Placing order...</p> : null}
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild className="border border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Link to="/orders">View orders fast</Link>
            </Button>
            <Button asChild className="border border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Link to="/cart">Back to cart</Link>
            </Button>
          </div>
        </GlassCard>
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

        <GlassCard className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow="Review" title="Cart summary" />
          <p className="text-xs uppercase tracking-[0.35em] text-gold">{cartCount} items</p>
          <div className="space-y-3 text-sm text-white/75">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/5" />
                  )}
                  <span className="truncate">{item.name} x {item.quantity}</span>
                </div>
                <span className="shrink-0">Rs. {item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <Button asChild className="w-full border border-white/10 bg-white/5 text-white hover:bg-white/10">
            <a href="/cart">Edit cart</a>
          </Button>
        </GlassCard>
      </div>
    </>
  );
}
