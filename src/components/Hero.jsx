import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe2, PackageCheck, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <span className="w-fit rounded-md bg-royal-light px-3 py-2 text-sm font-bold text-royal-blue">
            Trusted Global Trade Partner
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-royal-navy sm:text-5xl lg:text-6xl">
            Quality exports delivered with precision and confidence.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Royal Overseas connects reliable suppliers with international buyers through careful
            sourcing, documentation, inspection, and shipment coordination.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/products" className="btn-primary">
              Explore Products <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn-secondary">
              Request Quote
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ['25+', 'Markets'],
              ['100%', 'Export Focused'],
              ['24/7', 'Trade Support'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-2xl font-bold text-royal-blue">{value}</div>
                <div className="text-sm font-semibold text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?auto=format&fit=crop&w=1200&q=85"
            alt="Shipping containers prepared for global export"
            className="h-[420px] w-full rounded-lg object-cover shadow-soft lg:h-[560px]"
          />
          <div className="absolute bottom-5 left-5 right-5 grid gap-3 rounded-lg bg-white/95 p-4 shadow-soft backdrop-blur sm:grid-cols-3">
            {[
              [PackageCheck, 'Quality Checked'],
              [Globe2, 'Global Reach'],
              [ShieldCheck, 'Certified Supply'],
            ].map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-2 text-sm font-bold text-royal-navy">
                <Icon className="text-gold" size={20} />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
