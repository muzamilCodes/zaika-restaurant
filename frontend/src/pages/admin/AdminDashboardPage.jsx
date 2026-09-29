import { useEffect, useMemo, useState } from 'react';
import { adminService } from '../../services/adminService.js';
import { GlassCard, SectionHeading } from '../../components/ui.jsx';
import { InfoCard } from '../../components/InfoCard.jsx';
import { Seo } from '../../components/Seo.jsx';

function formatCurrency(value) {
  if (value === null || value === undefined) return 'Rs. 0';
  const num = Number(value);
  if (Number.isNaN(num)) return `Rs. ${value}`;
  return `Rs. ${num}`;
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState({ orders: 0, customers: 0, reservations: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const [status, setStatus] = useState({ type: 'loading', message: 'Loading admin data...' });

  const cards = useMemo(
    () => [
      { title: 'Revenue', value: formatCurrency(stats.revenue) },
      { title: 'Orders', value: stats.orders },
      { title: 'Customers', value: stats.customers },
      { title: 'Reservations', value: stats.reservations }
    ],
    [stats]
  );

  useEffect(() => {
    let alive = true;

    adminService
      .dashboard()
      .then((response) => {
        if (!alive) return;
        const data = response?.data || {};
        setStats(data.stats || { orders: 0, customers: 0, reservations: 0, revenue: 0 });
        setRecentOrders(data.recentOrders || []);
        setRecentReservations(data.recentReservations || []);
        setStatus({ type: 'success', message: '' });
      })
      .catch(() => {
        if (!alive) return;
        setStatus({
          type: 'error',
          message: 'Admin data could not be loaded. Please login as admin and check backend.'
        });
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Seo title="Admin Dashboard" description="Manage Zaika Restaurant operations." />
      <SectionHeading eyebrow="Dashboard" title="Analytics overview" description="A snapshot of your restaurant performance." />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <InfoCard key={c.title} title={c.title} value={c.value} />
        ))}
      </div>

      {status.message ? (
        <p className={`mt-4 text-sm ${status.type === 'error' ? 'text-gold' : 'text-white/60'}`}>{status.message}</p>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <GlassCard>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Recent orders</p>
          </div>
          <div className="mt-4 space-y-3">
            {recentOrders.length ? (
              recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-white/60">
                      {order.status} - {order.paymentMethod}
                    </p>
                  </div>
                  <p className="text-gold">{formatCurrency(order.total)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/60">No orders yet.</p>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Recent reservations</p>
          </div>
          <div className="mt-4 space-y-3">
            {recentReservations.length ? (
              recentReservations.map((reservation) => (
                <div key={reservation._id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3">
                  <div>
                    <p className="font-semibold">{reservation.name}</p>
                    <p className="text-sm text-white/60">
                      {reservation.guests} guests - {reservation.date ? new Date(reservation.date).toLocaleDateString() : ''} {reservation.time}
                    </p>
                  </div>
                  <p className="text-gold">{reservation.status}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/60">No reservations yet.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </>
  );
}

