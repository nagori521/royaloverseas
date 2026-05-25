import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <section className="section-padding bg-white">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-sm font-bold uppercase tracking-wide text-gold">About Us</span>
          <h1 className="mt-3 text-4xl font-bold text-royal-navy sm:text-5xl">
            Reliable trade support for international buyers.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Royal Overseas is an import export company focused on sourcing, packing,
            documentation, and shipment coordination for quality products. We work with verified
            suppliers and buyers who value consistency, clear communication, and professional
            execution.
          </p>
          <div className="mt-8 grid gap-4">
            {[
              'Supplier coordination and order follow-up',
              'Export documentation and compliance assistance',
              'Product inspection and packing supervision',
              'Responsive support from inquiry to delivery',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 font-semibold text-slate-700">
                <CheckCircle2 className="text-gold" size={22} />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.img
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=85"
          alt="Global logistics operations"
          className="h-[420px] w-full rounded-lg object-cover shadow-soft"
        />
      </div>
    </section>
  );
}
