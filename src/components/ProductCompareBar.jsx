import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function ProductCompareBar({ products, onClear }) {
  const [showComparison, setShowComparison] = useState(false);

  if (!products.length) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-40 rounded-lg border border-gold bg-white p-4 shadow-soft">
        <div className="container-page flex flex-col gap-4 p-0 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-bold text-royal-navy">Product Comparison</h3>
            <p className="text-sm text-slate-500">Selected: {products.map((product) => product.name).join(' vs ')}</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary" type="button" onClick={() => setShowComparison(true)}>Compare Now</button>
            <button className="grid h-11 w-11 place-items-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50" onClick={onClear} aria-label="Clear comparison">
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-royal-navy/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-soft"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-royal-navy">Product Comparison</h2>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 p-2"
                  onClick={() => setShowComparison(false)}
                  aria-label="Close comparison"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {products.map((product) => (
                  <div key={product.id || product._id} className="rounded-lg border border-slate-200 p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-48 w-full object-cover rounded-md mb-4"
                    />
                    <h3 className="text-lg font-bold text-royal-navy mb-4">{product.name}</h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-xs font-bold text-slate-500 uppercase">Category</dt>
                        <dd className="text-sm text-royal-navy font-semibold">{product.category}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold text-slate-500 uppercase">Packaging</dt>
                        <dd className="text-sm text-royal-navy font-semibold">{product.packaging}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold text-slate-500 uppercase">MOQ</dt>
                        <dd className="text-sm text-royal-navy font-semibold">{product.moq || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold text-slate-500 uppercase">Description</dt>
                        <dd className="text-sm text-slate-600 leading-5">{product.description}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
