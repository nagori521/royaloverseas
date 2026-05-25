import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GalleryHorizontal, Globe2, MessageSquareText, Package } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import { countries, galleryImages, inquiries, products } from '../../data.js';
import { api } from '../../services/api.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: products.length,
    totalInquiries: inquiries.length,
    totalCustomers: countries.length,
    galleryCount: galleryImages.length,
  });

  useEffect(() => {
    api.dashboard().then(setStats).catch(() => {});
  }, []);

  const cards = [
    ['Total Products', stats.totalProducts, Package],
    ['Total Inquiries', stats.totalInquiries, MessageSquareText],
    ['Total Customers', stats.totalCustomers, Globe2],
    ['Gallery Images', stats.galleryCount, GalleryHorizontal],
  ];

  return (
    <section className="p-5 sm:p-8">
      <AdminPageHeader title="Dashboard" subtitle="Overview of Royal Overseas export operations." />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon], index) => (
          <motion.article
            key={label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <Icon className="text-gold" size={30} />
            <p className="mt-5 text-sm font-bold uppercase tracking-wide text-slate-500">{label}</p>
            <h2 className="mt-2 text-4xl font-bold text-royal-navy">{value}</h2>
          </motion.article>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-royal-navy">Charts Placeholder</h2>
          <div className="mt-6 grid h-72 items-end gap-4 rounded-lg bg-slate-50 p-5 sm:grid-cols-6">
            {[62, 84, 55, 95, 70, 88].map((height, index) => (
              <div key={index} className="flex h-full items-end rounded-md bg-royal-light">
                <div className="w-full rounded-md bg-royal-blue" style={{ height: `${height}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-royal-navy">Recent Inquiries</h2>
          <div className="mt-5 grid gap-3">
            {inquiries.slice(0, 4).map((inquiry) => (
              <div key={inquiry.id} className="rounded-md border border-slate-100 p-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-bold text-royal-navy">{inquiry.name}</p>
                    <p className="text-sm text-slate-500">{inquiry.product}</p>
                  </div>
                  <span className="h-fit rounded-md bg-gold/15 px-3 py-1 text-xs font-bold text-royal-navy">
                    {inquiry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
