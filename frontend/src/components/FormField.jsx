export function FormField({ label, error, className = '', ...props }) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-sm text-white/75">{label}</span>
      <input
        {...props}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-gold/50 focus:bg-white/8"
      />
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </label>
  );
}

export function FormTextArea({ label, error, className = '', ...props }) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-sm text-white/75">{label}</span>
      <textarea
        {...props}
        className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-gold/50 focus:bg-white/8"
      />
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </label>
  );
}
