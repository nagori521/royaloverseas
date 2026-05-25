const filters = ['All', 'Rice', 'Spices', 'Detergent', 'Packaging', 'Factory'];

export default function GalleryFilter({ activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {filters.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`rounded-md border px-5 py-3 text-sm font-bold transition ${
            activeCategory === category
              ? 'border-gold bg-gold text-white shadow-soft'
              : 'border-white/20 bg-white/10 text-white hover:border-gold hover:bg-white/15'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
