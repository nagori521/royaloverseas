import { motion } from 'framer-motion';

export default function ContactInfoCard({ icon: Icon, title, value, detail, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <span className="grid h-12 w-12 place-items-center rounded-md bg-royal-light text-royal-blue">
        <Icon size={23} />
      </span>
      <h3 className="mt-5 text-lg font-bold text-royal-navy">{title}</h3>
      <p className="mt-2 font-semibold text-slate-700">{value}</p>
      {detail && <p className="mt-1 text-sm text-slate-500">{detail}</p>}
    </motion.article>
  );
}
