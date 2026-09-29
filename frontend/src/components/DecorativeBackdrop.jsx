export function DecorativeBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-ember/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
    </div>
  );
}
