import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function GalleryModal({ image, onClose }) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-royal-navy/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close gallery preview"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-md bg-white/90 text-royal-navy shadow-sm"
            >
              <X size={22} />
            </button>
            <img src={image.src} alt={image.title} className="max-h-[78vh] w-full object-cover" />
            <div className="p-5">
              <span className="text-sm font-bold uppercase tracking-wide text-gold">
                {image.category}
              </span>
              <h2 className="mt-1 text-2xl font-bold text-royal-navy">{image.title}</h2>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
