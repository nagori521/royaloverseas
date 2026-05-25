import { motion } from 'framer-motion';

const stats = [
  ['25+', 'Export Markets'],
  ['10+', 'Product Categories'],
  ['500+', 'Monthly Inquiries'],
  ['99%', 'Documentation Accuracy'],
];

export default function AnimatedStats() {
  return (
    <section className="bg-royal-navy py-14 text-white">
      <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label], index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className="rounded-lg border border-white/10 bg-white/5 p-6 text-center"
          >
            <div className="text-4xl font-bold text-gold">{value}</div>
            <div className="mt-2 text-sm font-semibold text-blue-100">{label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
