import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';

export default function GalleryGrid({ images, onPreview }) {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {images.map((image, index) => (
        <motion.button
          key={image.id}
          type="button"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: index * 0.04 }}
          onClick={() => onPreview(image)}
          className="group mb-6 block w-full break-inside-avoid overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm"
        >
          <div className="relative overflow-hidden">
            <img
              src={image.src}
              alt={image.title}
              className={`w-full object-cover transition duration-700 group-hover:scale-110 ${
                index % 3 === 0 ? 'h-80' : index % 2 === 0 ? 'h-64' : 'h-96'
              }`}
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-royal-navy/85 via-royal-navy/20 to-transparent p-5 opacity-95">
              <div className="w-full">
                <span className="rounded-md bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {image.category}
                </span>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-white">{image.title}</h3>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white/15 text-white backdrop-blur">
                    <Maximize2 size={18} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
