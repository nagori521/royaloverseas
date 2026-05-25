import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductQuickView({ product, onClose, onInquiry }) {
  return (
    <AnimatePresence>
      {product && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-royal-navy/70 p-4 backdrop-blur-sm">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-soft">
            <div className="grid md:grid-cols-2">
              <img src={product.image} alt={product.name} className="h-full min-h-80 w-full object-cover" />
              <div className="p-6">
                <button className="float-right rounded-md border border-slate-200 p-2" onClick={onClose} aria-label="Close quick view">
                  <X size={18} />
                </button>
                <span className="rounded-md bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">{product.category}</span>
                <h2 className="mt-5 text-3xl font-bold text-royal-navy">{product.name}</h2>
                <p className="mt-4 leading-7 text-slate-600">{product.description}</p>
                <div className="mt-5 rounded-md bg-slate-50 p-4 text-sm font-semibold text-slate-700">{product.packaging}</div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link to={`/products/${product.id}`} className="btn-secondary" onClick={onClose}>View Details</Link>
                  <button className="btn-primary" onClick={() => { onInquiry(product); onClose(); }}>
                    <MessageCircle size={18} /> Send Inquiry
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
