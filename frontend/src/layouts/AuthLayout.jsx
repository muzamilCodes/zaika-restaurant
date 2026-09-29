import { Outlet } from 'react-router-dom';
import { DecorativeBackdrop } from '../components/DecorativeBackdrop.jsx';

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-900 text-white">
      <DecorativeBackdrop />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}
