const logos = ['Gulf Trade', 'Maple Imports', 'Britannia Wholesale', 'Desert Mart', 'Pacific Foods'];

export default function LogoSlider() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-8 dark:border-white/10 dark:bg-slate-900">
      <div className="container-page overflow-hidden">
        <div className="flex animate-[marquee_18s_linear_infinite] gap-5 whitespace-nowrap">
          {[...logos, ...logos].map((logo, index) => (
            <span key={`${logo}-${index}`} className="rounded-md border border-slate-200 bg-white px-8 py-4 text-lg font-bold text-royal-navy shadow-sm">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
