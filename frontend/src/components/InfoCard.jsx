import { GlassCard } from './ui.jsx';

export function InfoCard({ title, value, detail }) {
  return (
    <GlassCard className="p-3 sm:p-5">
      <p className="text-[10px] uppercase tracking-[0.25em] text-gold sm:text-xs sm:tracking-[0.3em]">{title}</p>
      <p className="mt-2 break-words font-display text-2xl text-white sm:mt-3 sm:text-3xl">{value}</p>
      {detail ? <p className="mt-2 text-sm text-white/65">{detail}</p> : null}
    </GlassCard>
  );
}
