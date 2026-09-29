const colors = {
  pending: 'bg-yellow-500/15 text-yellow-300',
  confirmed: 'bg-blue-500/15 text-blue-300',
  preparing: 'bg-orange-500/15 text-orange-300',
  out_for_delivery: 'bg-cyan-500/15 text-cyan-300',
  delivered: 'bg-emerald-500/15 text-emerald-300',
  cancelled: 'bg-red-500/15 text-red-300'
};

export function OrderStatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${colors[status] || 'bg-white/10 text-white/70'}`}>
      {status.replaceAll('_', ' ')}
    </span>
  );
}
