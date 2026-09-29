import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

export function ProtectedRoute({ children, admin = false }) {
  const normalizeRole = (value) => String(value || '').replace(/["']/g, '').trim().toLowerCase();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const loading = useAuthStore((state) => state.loading);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  // Wait until persisted auth state has been restored before deciding.
  // This prevents a flash redirect on direct loads like /admin.
  if (!hasHydrated || (loading && user == null)) {
    return null;
  }

  if (!user || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (admin) {
    const isAdmin =
      normalizeRole(user?.role).includes('admin') ||
      user?.isAdmin === true ||
      user?.admin === true;
    if (!isAdmin) return <Navigate to="/login" replace />;
  }

  return children;
}
