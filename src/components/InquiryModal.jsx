import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { api } from '../services/api.js';

export default function InquiryModal({ product, open, onClose }) {
  const [status, setStatus] = useState('');
  const submitInquiry = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await api.createInquiry({
        customerName: formData.get('customerName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        product: product.name || product.title,
        message: formData.get('message'),
      });
      setStatus('Inquiry submitted successfully.');
      event.currentTarget.reset();
    } catch {
      setStatus('Inquiry saved in frontend preview. Start backend to store in MongoDB.');
    }
  };

  return (
    <AnimatePresence>
      {open && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-royal-navy/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-sm font-bold uppercase tracking-wide text-gold">
                  Product Inquiry
                </span>
                <h2 className="mt-1 text-2xl font-bold text-royal-navy">{product.name || product.title}</h2>
              </div>
              <button
                type="button"
                aria-label="Close inquiry modal"
                onClick={onClose}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-slate-200 text-slate-600 hover:text-royal-blue"
              >
                <X size={20} />
              </button>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={submitInquiry}>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['Name', 'customerName', 'text', 'Your name'],
                  ['Email', 'email', 'email', 'you@example.com'],
                  ['Phone', 'phone', 'tel', '+91 98765 43210'],
                  ['Country', 'country', 'text', 'Destination country'],
                ].map(([label, name, type, placeholder]) => (
                  <label key={label} className="grid gap-2 text-sm font-semibold text-slate-700">
                    {label}
                    <input
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      required
                      className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue"
                    />
                  </label>
                ))}
              </div>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Product Name
                <input
                  value={product.name || product.title}
                  readOnly
                  className="rounded-md border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Message
                <textarea
                  name="message"
                  rows="5"
                  defaultValue={`I am interested in ${product.name || product.title}. Please share export details and quotation.`}
                  required
                  className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue"
                />
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" className="btn-primary">
                  Submit Inquiry
                </button>
                <a
                  href={`https://wa.me/?text=Hello Royal Overseas, I want to inquire about ${encodeURIComponent(product.name || product.title)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              </div>
              {status && <p className="rounded-md bg-royal-light p-3 text-sm font-semibold text-royal-blue">{status}</p>}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
