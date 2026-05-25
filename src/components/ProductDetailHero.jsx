import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';

export default function ProductDetailHero({ product, onInquiry }) {
  const [activeImage, setActiveImage] = useState(product.gallery?.[0] || product.image);

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container-page grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-royal-light shadow-soft">
            <img src={activeImage} alt={product.name} className="h-[420px] w-full object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {(product.gallery || [product.image]).map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                className={`overflow-hidden rounded-md border-2 ${
                  activeImage === image ? 'border-gold' : 'border-transparent'
                }`}
              >
                <img src={image} alt={product.name} className="h-24 w-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
          <span className="rounded-md bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {product.category}
          </span>
          <h1 className="mt-5 text-4xl font-bold text-royal-navy sm:text-5xl">{product.name}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{product.description}</p>

          <div className="mt-7">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Packaging Sizes
            </h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {(product.packagingSizes || []).map((size) => (
                <span
                  key={size}
                  className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-royal-navy"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 w-fit rounded-md bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            Availability: Export Ready
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://wa.me/919909582400?text=Hello%20Royal%20Overseas,%20I%20am%20interested%20in%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={18} />
              WhatsApp Inquiry
            </a>
            <button type="button" className="btn-secondary" onClick={() => onInquiry(product)}>
              <Send size={18} />
              Get Quote
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
