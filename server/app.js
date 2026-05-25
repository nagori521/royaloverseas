import express from 'express';
import cors from 'cors';

import auditRoutes from './routes/auditRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Royal Overseas API Running',
  });
});

app.post('/api/auth/login', (req, res, next) => {
  const { email, password } = req.body;

  if (email === 'admin@royaloverseas.com' && password === 'admin123') {
    return res.json({
      token: 'royal_admin_token',
      user: {
        _id: '000000000000000000000001',
        name: 'Admin User',
        email,
        role: 'admin',
        status: 'active',
        permissions: [
          'dashboard',
          'products_view',
          'products_create',
          'products_edit',
          'products_delete',
          'gallery_view',
          'gallery_create',
          'gallery_edit',
          'gallery_delete',
          'inquiries_view',
          'inquiries_respond',
          'customers_view',
          'customers_export',
          'settings_view',
          'settings_edit',
          'users_manage',
          'audit_logs_view',
          'notifications_manage',
        ],
        departments: ['management'],
      },
    });
  }

  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditRoutes);

export default app;
