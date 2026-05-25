import { motion } from 'framer-motion';

const testimonials = [
  ['Gulf Food Trading', 'Reliable rice shipments, clear paperwork, and responsive updates.'],
  ['Maple Import Co.', 'Royal Overseas handled packaging requirements with excellent coordination.'],
  ['Britannia Wholesale', 'Professional spice sourcing with consistent quality and shipment timing.'],
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-white dark:bg-slate-950">
      <div className="container-page">
        <h2 className="section-title dark:text-white">Trusted By Global Buyers</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map(([name, quote], index) => (
            <motion.figure
              key={name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
            >
              <blockquote className="leading-7 text-slate-600 dark:text-slate-300">"{quote}"</blockquote>
              <figcaption className="mt-5 font-bold text-royal-navy dark:text-white">{name}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
