import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { orderService } from '../services/orderService.js';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { OrderStatusBadge } from '../components/OrderStatusBadge.jsx';
import { Seo } from '../components/Seo.jsx';

export function OrdersPage() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  useEffect(() => {
    const savedOrderNumber = localStorage.getItem('zaika-last-order-number') || '';
    const stateOrderNumber = location.state?.highlightOrderNumber || '';
    setTrackingNumber(stateOrderNumber || savedOrderNumber);

    orderService.getMyOrders().then((response) => setOrders(response.data.orders || [])).catch(() => setOrders([]));
  }, [location.state]);

  useEffect(() => {
    if (orders.length && trackingNumber && !trackingResult) {
      const match = orders.find((order) => order.orderNumber === trackingNumber);
      if (match) {
        setTrackingResult({
          orderNumber: match.orderNumber,
          status: match.status,
          estimatedDeliveryMinutes: match.estimatedDeliveryMinutes
        });
      }
    }
  }, [orders, trackingNumber, trackingResult]);

  const downloadInvoice = async (orderId) => {
    const response = await orderService.downloadInvoice(orderId);
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'zaika-invoice.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  const cancelOrder = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      const response = await orderService.getMyOrders();
      setOrders(response.data.orders || []);
    } catch {
      // silent fail; UI keeps current state
    }
  };

  const trackOrder = async () => {
    if (!trackingNumber) return;
    const response = await orderService.trackOrder(trackingNumber);
    setTrackingResult(response.data);
  };

  return (
    <>
      <Seo title="Orders" description="Track your Zaika Restaurant order history." />
      <SectionHeading eyebrow="Orders" title="Order history" />
      {orders.length ? (
        <GlassCard className="mt-8 border border-gold/20 bg-gold/10">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Latest order</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-2xl">{orders[0].orderNumber}</p>
              <p className="mt-1 text-sm text-white/65">Rs. {orders[0].total}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <OrderStatusBadge status={orders[0].status} />
              <Button
                onClick={() => downloadInvoice(orders[0]._id)}
                className="border border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Download invoice
              </Button>
            </div>
          </div>
        </GlassCard>
      ) : null}
      <GlassCard className="mt-8 space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">Track order</p>
        <div className="flex flex-wrap gap-3">
          <input
            value={trackingNumber}
            onChange={(event) => {
              setTrackingNumber(event.target.value);
              setTrackingResult(null);
            }}
            placeholder="Enter order number"
            className="min-w-72 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
          />
          <Button onClick={trackOrder} className="bg-gold text-surface-900 hover:bg-[#efcf88]">
            Track
          </Button>
        </div>
        {trackingResult ? (
          <p className="text-sm text-white/70">
            Current status: <span className="text-gold">{trackingResult.status}</span>
          </p>
        ) : null}
      </GlassCard>
      <div className="mt-8 space-y-4">
        {orders.map((order) => {
          const canCancel = order.status !== 'cancelled' && order.status !== 'delivered';

          return (
            <GlassCard
              key={order._id}
              className={order.orderNumber === trackingNumber ? 'border border-gold/30 bg-gold/5' : ''}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-2xl">{order.orderNumber}</p>
                  <p className="mt-1 text-sm text-white/65">Rs. {order.total}</p>
                  <div className="mt-3 space-y-2">
                    {(order.items || []).map((it, idx) => (
                      <div key={`${it._id || it.product || it.name || idx}`} className="flex items-center gap-3">
                        {it.image ? (
                          <img
                            src={it.image}
                            alt={it.name}
                            className="h-12 w-12 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-2xl bg-white/5" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{it.name}</p>
                          <p className="text-xs text-white/60">Qty: {it.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <Button
                    onClick={() => downloadInvoice(order._id)}
                    className="border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    Download invoice
                  </Button>
                  <Button
                    onClick={() => cancelOrder(order._id)}
                    disabled={!canCancel}
                    className={canCancel ? 'bg-red-500/20 text-white hover:bg-red-500/30 border border-red-500/30' : 'opacity-60'}
                  >
                    Cancel order
                  </Button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </>
  );
}
