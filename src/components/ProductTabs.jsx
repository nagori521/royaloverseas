export default function ProductTabs({ activeCategory, onChange, categories = ['All', 'Rice', 'Spices', 'Detergent'] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const active = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-md border px-5 py-3 text-sm font-bold transition ${
              active
                ? 'border-royal-blue bg-royal-blue text-white shadow-soft'
                : 'border-slate-200 bg-white text-royal-navy hover:border-gold hover:text-royal-blue'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
