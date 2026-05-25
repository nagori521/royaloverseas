import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, GitCompare, MessageCircle, Package, Search } from 'lucide-react';

export default function ProductCard({
  product,
  index = 0,
  onInquiry,
  onQuickView,
  onCompare,
  compareActive = false,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-soft"
    >
      <div className="relative h-56 overflow-hidden bg-royal-light">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-md bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {product.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="mt-2 text-xl font-bold text-royal-navy">{product.name}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
        <div className="mt-4 flex items-start gap-2 rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-600">
          <Package className="mt-0.5 shrink-0 text-royal-blue" size={17} />
          <span>{product.packaging}</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link to={`/products/${product.id}`} className="btn-secondary px-3 py-2">
            <Search size={16} />
            View Details
          </Link>
          <button
            type="button"
            className="btn-primary px-3 py-2"
            onClick={() => onInquiry?.(product)}
          >
            <MessageCircle size={16} />
            Send Inquiry
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button type="button" className="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-royal-blue hover:border-gold" onClick={() => onQuickView?.(product)}>
            <Eye className="inline" size={16} /> Quick View
          </button>
          <button type="button" className={`rounded-md border px-3 py-2 text-sm font-bold ${compareActive ? 'border-gold bg-gold text-white' : 'border-slate-200 text-royal-blue hover:border-gold'}`} onClick={() => onCompare?.(product)}>
            <GitCompare className="inline" size={16} /> Compare
          </button>
        </div>
      </div>
    </motion.article>
  );
}
