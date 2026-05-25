import { motion } from 'framer-motion';
import { MapPinned } from 'lucide-react';
import { countries } from '../data.js';

export default function WorldMap() {
  return (
    <section className="section-padding bg-white dark:bg-slate-950">
      <div className="container-page">
        <h2 className="section-title dark:text-white">Interactive Export Countries Map</h2>
        <p className="section-copy dark:text-slate-300">
          Explore core destination regions served by Royal Overseas.
        </p>
        <div className="relative mt-10 min-h-[420px] overflow-hidden rounded-lg border border-slate-200 bg-royal-light p-6 shadow-soft">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(#0A3D91_1px,transparent_1px),linear-gradient(90deg,#0A3D91_1px,transparent_1px)] [background-size:44px_44px]" />
          {countries.map((country, index) => (
            <motion.div
              key={country.country}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute rounded-md bg-white px-3 py-2 text-xs font-bold text-royal-navy shadow-sm"
              style={{
                left: `${15 + ((index * 13) % 70)}%`,
                top: `${18 + ((index * 17) % 58)}%`,
              }}
            >
              <MapPinned className="mr-1 inline text-gold" size={14} />
              {country.country}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
