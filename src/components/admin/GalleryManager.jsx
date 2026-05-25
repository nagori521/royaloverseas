import { Pencil, Trash2 } from 'lucide-react';

export default function GalleryManager({ images, onDelete, onEdit, onPreview }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {images.map((image) => {
        const imageId = image.id || image._id;
        return (
        <article key={imageId} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <button type="button" className="block w-full" onClick={() => onPreview?.(image)}>
            <img src={image.src} alt={image.title} className="h-56 w-full object-cover" />
          </button>
          <div className="p-4">
            <span className="rounded-md bg-gold/15 px-3 py-1 text-xs font-bold text-royal-navy">{image.category}</span>
            <h3 className="mt-3 font-bold text-royal-navy">{image.title}</h3>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-gold"
                onClick={() => onEdit(image)}
              >
                <Pencil className="inline" size={16} /> Edit title
              </button>
              <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-red-600" onClick={() => onDelete(imageId)}>
                <Trash2 className="inline" size={16} /> Delete
              </button>
            </div>
          </div>
        </article>
      );
      })}
    </div>
  );
}
