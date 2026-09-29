import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Button, GlassCard, SectionHeading } from '../../components/ui.jsx';
import { OrderStatusBadge } from '../../components/OrderStatusBadge.jsx';
import { Seo } from '../../components/Seo.jsx';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    const response = await api.get('/admin/orders');
    setOrders(response.data.orders || []);
  };

  useEffect(() => {
    loadOrders().catch(() => setError('Orders could not be loaded.'));
  }, []);

  const deleteOrder = async (id) => {
    try {
      setError('');
      await api.delete(`/admin/orders/${id}`);
      await loadOrders();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete order.');
    }
  };

  return (
    <>
      <Seo title="Admin Orders" description="Manage order statuses." />
      <SectionHeading eyebrow="Order management" title="Orders" />
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <div className="mt-8 space-y-4">
        {orders.length ? (
          orders.map((order) => (
            <GlassCard key={order._id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-display text-xl sm:text-2xl text-white">{order.orderNumber}</p>
                  <p className="text-sm text-gold font-medium">Rs. {order.total}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {order.user?.name || order.shippingAddress?.fullName || 'Customer'} • {order.items?.length || 1} items
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                  <OrderStatusBadge status={order.status} />
                  <select
                    value={order.status}
                    onChange={(event) =>
                      api.patch(`/orders/${order._id}/status`, { status: event.target.value }).then(() => loadOrders())
                    }
                    className="w-full rounded-full border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-gold sm:w-auto"
                  >
                    <option value="pending" className="bg-[#181410] text-white">Pending</option>
                    <option value="confirmed" className="bg-[#181410] text-white">Confirmed</option>
                    <option value="preparing" className="bg-[#181410] text-white">Preparing</option>
                    <option value="out_for_delivery" className="bg-[#181410] text-white">Out for delivery</option>
                    <option value="delivered" className="bg-[#181410] text-white">Delivered</option>
                    <option value="cancelled" className="bg-[#181410] text-white">Cancelled</option>
                  </select>
                  <Button
                    type="button"
                    onClick={() => deleteOrder(order._id)}
                    className="w-full border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20 sm:w-auto"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <GlassCard className="p-8 text-center text-white/60">
            No orders placed yet.
          </GlassCard>
        )}
      </div>
    </>
  );
}
