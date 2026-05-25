import { motion } from 'framer-motion';
import { MapPinned } from 'lucide-react';

export default function CountryCard({ market, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-royal-navy">{market.country}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">{market.region}</p>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-royal-light text-royal-blue">
          <MapPinned size={22} />
        </span>
      </div>
      <div className="mt-5 w-fit rounded-md bg-gold/15 px-3 py-1 text-xs font-bold text-royal-navy">
        {market.code}
      </div>
    </motion.article>
  );
}
