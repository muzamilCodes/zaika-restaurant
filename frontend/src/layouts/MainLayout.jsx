import { Outlet } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';

export function MainLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-hero text-white">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
