import CountryCard from '../components/CountryCard.jsx';
import WorldMap from '../components/WorldMap.jsx';
import { countries } from '../data.js';

export default function ExportMarkets() {
  return (
    <>
      <WorldMap />
      <section className="section-padding bg-slate-50">
        <div className="container-page">
          <span className="text-sm font-bold uppercase tracking-wide text-gold">Export Markets</span>
          <h1 className="mt-3 text-4xl font-bold text-royal-navy sm:text-5xl">Markets We Serve</h1>
          <p className="section-copy">
            Royal Overseas supports trade requirements across multiple regions with attention to
            documentation, packing standards, and buyer-specific import expectations.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((market, index) => (
              <CountryCard key={market.country} market={market} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
