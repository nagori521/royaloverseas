import { motion } from 'framer-motion';
import { ClipboardCheck, PackageCheck, Ship, FileCheck } from 'lucide-react';

const steps = [
  [ClipboardCheck, 'Inquiry Review'],
  [PackageCheck, 'Quality & Packaging'],
  [FileCheck, 'Documentation'],
  [Ship, 'Global Dispatch'],
];

export default function ExportProcess() {
  return (
    <section className="section-padding bg-white dark:bg-slate-950">
      <div className="container-page">
        <h2 className="section-title dark:text-white">Export Process</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {steps.map(([Icon, label], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-lg border border-slate-200 p-6 text-center shadow-sm dark:border-white/10"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-royal-light text-royal-blue">
                <Icon size={24} />
              </span>
              <h3 className="mt-4 font-bold text-royal-navy dark:text-white">{label}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
