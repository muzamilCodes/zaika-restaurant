import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MainLayout } from './layouts/MainLayout.jsx';
import { AuthLayout } from './layouts/AuthLayout.jsx';
import { AdminLayout } from './layouts/AdminLayout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { MenuPage } from './pages/MenuPage.jsx';
import { FoodDetailsPage } from './pages/FoodDetailsPage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { ReservationPage } from './pages/ReservationPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { GalleryPage } from './pages/GalleryPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.jsx';
import { ResetPasswordPage } from './pages/ResetPasswordPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { OrdersPage } from './pages/OrdersPage.jsx';
import { WishlistPage } from './pages/WishlistPage.jsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.jsx';
import { AdminProductsPage } from './pages/admin/AdminProductsPage.jsx';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage.jsx';
import { AdminReservationsPage } from './pages/admin/AdminReservationsPage.jsx';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage.jsx';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage.jsx';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage.jsx';
import { AdminContactsPage } from './pages/admin/AdminContactsPage.jsx';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

function AppShell({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="font-body">
      <AppShell>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/food/:identifier" element={<FoodDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="/reservations" element={<ReservationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute admin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="reservations" element={<AdminReservationsPage />} />
            <Route path="contacts" element={<AdminContactsPage />} />
            <Route path="gallery" element={<AdminGalleryPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
          </Route>

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AppShell>
    </div>
  );
}
