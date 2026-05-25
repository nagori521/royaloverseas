import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import ExportMarkets from './pages/ExportMarkets.jsx';
import Gallery from './pages/Gallery.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';

import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminGallery from './pages/admin/AdminGallery.jsx';
import AdminInquiries from './pages/admin/AdminInquiries.jsx';
import AdminCustomers from './pages/admin/AdminCustomers.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';
import AdminUserManagement from './pages/admin/AdminUserManagement.jsx';
import AdminAuditLogs from './pages/admin/AdminAuditLogs.jsx';
import AdminProfile from './pages/admin/AdminProfile.jsx';

export default function App() {
  return (
    <Routes>

      {/* PUBLIC */}

      <Route element={<MainLayout />}>

        <Route index element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/products/:id"
          element={<ProductDetail />}
        />

        <Route
          path="/export-markets"
          element={<ExportMarkets />}
        />

        <Route
          path="/gallery"
          element={<Gallery />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

      </Route>


      {/* LOGIN */}

      <Route
        path="/ro-panel-2026/login"
        element={<AdminLogin />}
      />


      {/* ADMIN */}

      <Route element={<ProtectedAdminRoute />}>

        <Route
          path="/ro-panel-2026"
          element={<AdminLayout />}
        >

          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="gallery"
            element={<AdminGallery />}
          />

          <Route
            path="inquiries"
            element={<AdminInquiries />}
          />

          <Route
            path="customers"
            element={<AdminCustomers />}
          />

          <Route
            path="users"
            element={<AdminUserManagement />}
          />

          <Route
            path="settings"
            element={<AdminSettings />}
          />

          <Route
            path="profile"
            element={<AdminProfile />}
          />

          <Route
            path="audit"
            element={<AdminAuditLogs />}
          />

        </Route>

      </Route>


      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}
