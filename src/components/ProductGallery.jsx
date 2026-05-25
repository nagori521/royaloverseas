import { motion } from 'framer-motion';

export default function ProductGallery({ images = [], title = 'Product gallery' }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <motion.figure
          key={`${image}-${index}`}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <img
            src={image}
            alt={`${title} ${index + 1}`}
            className="h-64 w-full object-cover transition duration-500 hover:scale-105"
          />
        </motion.figure>
      ))}
    </div>
  );
}
