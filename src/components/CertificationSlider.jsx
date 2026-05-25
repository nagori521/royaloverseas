import { certifications } from '../data.js';

export default function CertificationSlider() {
  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-900">
      <div className="container-page">
        <h2 className="section-title dark:text-white">Certifications & Compliance</h2>
        <div className="mt-8 flex gap-5 overflow-x-auto pb-3">
          {certifications.map((item) => (
            <article key={item.title} className="min-w-72 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-gold">✓</div>
              <h3 className="mt-4 text-xl font-bold text-royal-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
