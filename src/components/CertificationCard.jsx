import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';

export default function CertificationCard({ certification, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <BadgeCheck className="text-gold" size={34} />
      <h3 className="mt-4 text-xl font-bold text-royal-navy">{certification.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{certification.detail}</p>
    </motion.article>
  );
}
