import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import GalleryManager from '../../components/admin/GalleryManager.jsx';
import GalleryModal from '../../components/GalleryModal.jsx';
import UploadImageModal from '../../components/admin/UploadImageModal.jsx';
import { galleryImages as seedGalleryImages } from '../../data.js';
import { api } from '../../services/api.js';
import { normalizeGalleryImage } from '../../utils/normalize.js';

export default function AdminGallery() {
  const [images, setImages] = useState(seedGalleryImages);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  const fetchGallery = () => {
    return api.gallery()
      .then((items) => setImages(items.map(normalizeGalleryImage)))
      .catch(() => {});
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openEdit = (image) => {
    setEditingImage(image);
    setTitle(image.title || '');
    setImageFile(null);
    setMessage('');
  };

  const saveTitle = async (event) => {
    event.preventDefault();

    if (!editingImage) return;

    const id = editingImage.id || editingImage._id;
    if (imageFile) {
      const payload = new FormData();
      payload.append('title', title);
      payload.append('image', imageFile);
      await api.updateGallery(id, payload);
    } else {
      await api.updateGallery(id, { title });
    }
    await fetchGallery();
    setEditingImage(null);
    setTitle('');
    setImageFile(null);
    setMessage('Gallery updated successfully');
  };

  return (
    <section className="p-5 sm:p-8">
      <AdminPageHeader
        title="Gallery Management"
        subtitle="Upload images, edit titles, select categories, and remove gallery items."
        action={
          <button type="button" className="btn-primary" onClick={() => setUploadOpen(true)}>
            <Upload size={18} />
            Upload Image
          </button>
        }
      />
      {message && (
        <div className="mb-5 rounded-md bg-green-50 p-3 text-sm font-semibold text-green-800">
          {message}
        </div>
      )}
      <GalleryManager
        images={images}
        onEdit={openEdit}
        onPreview={setPreviewImage}
        onDelete={(id) => {
          api.deleteGallery(id)
            .then(() => {
              setImages((items) => items.filter((item) => (item.id || item._id) !== id));
              setMessage('Gallery deleted successfully');
            })
            .catch((err) => {
              console.error('Failed to delete gallery:', err);
            });
        }}
      />
      {editingImage && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-royal-navy/70 p-4 backdrop-blur-sm">
          <form onSubmit={saveTitle} className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-royal-navy">Edit Gallery Title</h2>
            <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
              Title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue"
                required
              />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
              Update image
              <input
                type="file"
                onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue"
              />
            </label>
            <div className="mt-5 flex gap-3">
              <button type="submit" className="btn-primary">
                Save
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setEditingImage(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <UploadImageModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSave={() => {
          setMessage('Gallery image saved successfully');
          fetchGallery();
        }}
      />
      <GalleryModal image={previewImage} onClose={() => setPreviewImage(null)} />
    </section>
  );
}
