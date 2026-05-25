import { useState } from 'react';
import { api } from '../../services/api.js';

export default function AddProductForm({ onSave }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Rice',
    packaging: '',
    moq: '',
    countryAvailability: 'Worldwide',
    description: '',
  });
  const [categoryMode, setCategoryMode] = useState('existing');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateCategory = (value) => {
    if (value === '__new__') {
      setCategoryMode('new');
      updateField('category', '');
      return;
    }

    setCategoryMode('existing');
    updateField('category', value);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      images.forEach((image) => payload.append('images', image));
      await api.createProduct(payload);
      onSave?.();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={submit}>
      <h2 className="text-xl font-bold text-royal-navy">Add Product</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Product Name
          <input value={form.name} onChange={(event) => updateField('name', event.target.value)} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue" required />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Category
          <select value={categoryMode === 'new' ? '__new__' : form.category} onChange={(event) => updateCategory(event.target.value)} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue">
            <option>Rice</option>
            <option>Spices</option>
            <option>Detergent</option>
            <option value="__new__">+ Add New Category</option>
          </select>
          {categoryMode === 'new' && (
            <input
              value={form.category}
              onChange={(event) => updateField('category', event.target.value)}
              placeholder="Enter category"
              className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue"
              required
            />
          )}
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Packaging
          <input value={form.packaging} onChange={(event) => updateField('packaging', event.target.value)} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue" required />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          MOQ
          <input value={form.moq} onChange={(event) => updateField('moq', event.target.value)} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue" required />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Country Availability
          <input value={form.countryAvailability} onChange={(event) => updateField('countryAvailability', event.target.value)} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
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
        {saving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
