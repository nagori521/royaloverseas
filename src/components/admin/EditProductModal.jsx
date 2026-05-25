import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';

export default function EditProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    packaging: '',
    moq: '',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name || '',
      category: product.category || '',
      packaging: product.packaging || '',
      moq: product.moq || product.MOQ || '',
      description: product.description || '',
    });
    setImages([]);
    setError('');
  }, [product]);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!product) return;

    setSaving(true);
    setError('');

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      images.forEach((image) => payload.append('images', image));
      await api.updateProduct(product.id || product._id, payload);
      onSave?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-royal-navy/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-soft"
            onSubmit={submit}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-bold text-royal-navy">Edit Product</h2>
              <button type="button" className="rounded-md border border-slate-200 p-2" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Product Name
                <input value={form.name} onChange={(event) => updateField('name', event.target.value)} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue" required />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Category
                <input value={form.category} onChange={(event) => updateField('category', event.target.value)} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue" required />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Packaging
                <input value={form.packaging} onChange={(event) => updateField('packaging', event.target.value)} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue" required />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                MOQ
                <input value={form.moq} onChange={(event) => updateField('moq', event.target.value)} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue" required />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
                Upload Images
                <input type="file" multiple onChange={(event) => setImages(Array.from(event.target.files || []))} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue" />
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
              Description
              <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows="4" className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue" required />
            </label>
            {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
            <button type="submit" className="btn-primary mt-5" disabled={saving}>
              {saving ? 'Updating...' : 'Update'}
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
