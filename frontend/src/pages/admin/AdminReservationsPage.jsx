import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Button, GlassCard, SectionHeading } from '../../components/ui.jsx';
import { Seo } from '../../components/Seo.jsx';

export function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');

  const loadReservations = async () => {
    try {
      const response = await api.get('/admin/reservations');
      setReservations(response.data.reservations || []);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load reservations.');
    }
  };

  useEffect(() => {
    loadReservations().catch(() => null);
  }, []);

  const deleteReservation = async (id) => {
    try {
      setError('');
      await api.delete(`/admin/reservations/${id}`);
      await loadReservations();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete reservation.');
    }
  };

  return (
    <>
      <Seo title="Admin Reservations" description="Manage reservation requests." />
      <SectionHeading eyebrow="Reservations" title="Reservation management" />
      <div className="mt-8 space-y-4">
        {reservations.map((reservation) => (
          <GlassCard key={reservation._id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl">{reservation.name}</p>
              <p className="mt-2 text-sm text-white/65">
                {reservation.guests} guests on {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-gold">
                {reservation.isOtpVerified ? 'OTP verified' : 'OTP pending'} - {reservation.status}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => api.patch(`/reservations/${reservation._id}/status`, { status: 'accepted' }).then(loadReservations)}
                className="bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25"
              >
                Accept
              </Button>
              <Button
                type="button"
                onClick={() => api.patch(`/reservations/${reservation._id}/status`, { status: 'rejected' }).then(loadReservations)}
                className="bg-red-500/15 text-red-200 hover:bg-red-500/25"
              >
                Reject
              </Button>
              <Button
                type="button"
                onClick={() => deleteReservation(reservation._id)}
                className="border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
              >
                Delete
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
