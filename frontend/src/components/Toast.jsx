import { useEffect } from 'react';

export function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose?.(), 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  const bg = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-black/70';

  return (
    <div className={`fixed right-6 top-6 z-50 max-w-xs rounded-lg p-3 text-white ${bg} shadow-lg`} role="status">
      <div className="text-sm">{message}</div>
    </div>
  );
}

export default Toast;
