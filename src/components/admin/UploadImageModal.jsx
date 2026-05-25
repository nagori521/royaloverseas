import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { api } from '../../services/api.js';

export default function UploadImageModal({ open, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Rice');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append('title', title);
      payload.append('category', category);
      if (image) payload.append('image', image);
      await api.createGallery(payload);
      setTitle('');
      setCategory('Rice');
      setImage(null);
      onSave?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to upload gallery image');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-royal-navy/70 p-4 backdrop-blur-sm">
          <motion.form initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-xl rounded-lg bg-white p-6 shadow-soft" onSubmit={submit}>
            <div className="flex justify-between gap-4">
              <h2 className="text-2xl font-bold text-royal-navy">Upload Image</h2>
              <button type="button" className="rounded-md border border-slate-200 p-2" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
            <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
              Title
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue" required />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue">
                <option>Rice</option>
                <option>Spices</option>
                <option>Detergent</option>
                <option>Packaging</option>
                <option>Factory</option>
              </select>
            </label>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
              Upload image
              <input type="file" onChange={(event) => setImage(event.target.files?.[0] || null)} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue" required />
            </label>
            {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
            <button type="submit" className="btn-primary mt-5" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
