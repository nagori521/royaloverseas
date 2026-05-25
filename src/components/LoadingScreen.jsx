import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: 'none' }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="fixed inset-0 z-[200] grid place-items-center bg-royal-navy text-white"
    >
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-gold" />
        <h1 className="mt-5 text-2xl font-bold">Royal Overseas</h1>
      </div>
    </motion.div>
  );
}
