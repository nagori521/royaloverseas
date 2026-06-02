import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ClipboardCheck, Globe, Handshake, Truck } from 'lucide-react';
import AnimatedStats from '../components/AnimatedStats.jsx';
import CertificationCard from '../components/CertificationCard.jsx';
import CertificationSlider from '../components/CertificationSlider.jsx';
import CountryCard from '../components/CountryCard.jsx';
import ExportProcess from '../components/ExportProcess.jsx';
import Hero from '../components/Hero.jsx';
import LogoSlider from '../components/LogoSlider.jsx';
import Newsletter from '../components/Newsletter.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductCompareBar from '../components/ProductCompareBar.jsx';
import ProductQuickView from '../components/ProductQuickView.jsx';
import SEO from '../components/SEO.jsx';
import Testimonials from '../components/Testimonials.jsx';
import { certifications, countries, products } from '../data.js';

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const navigate = useNavigate();

  const handleSendInquiry = (product) => {
    navigate('/contact#inquiry-form', { state: { productName: product?.name || product?.title || '' } });
  };

  const toggleCompare = (product) => {
    setCompareProducts((items) =>
      items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items, product]
    );
  };

  return (
    <>
      <SEO />
      <Hero />
      <LogoSlider />
      <AnimatedStats />

      <section className="section-padding bg-slate-50">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-copy">
                Export-ready products sourced for dependable quality, packing, and delivery.
              </p>
            </div>
            <Link to="/products" className="btn-secondary w-fit">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onInquiry={handleSendInquiry}
                onQuickView={setQuickViewProduct}
                onCompare={toggleCompare}
                compareActive={compareProducts.some((item) => item.id === product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-copy">
            A practical export partner for buyers who need clarity, reliability, and responsive
            coordination from inquiry to shipment.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              [ClipboardCheck, 'Quality Control', 'Inspection-focused sourcing before dispatch.'],
              [Truck, 'Smooth Logistics', 'Shipment coordination by air, sea, and road.'],
              [Globe, 'Global Network', 'Buyer support across key export markets.'],
              [Handshake, 'Transparent Deals', 'Clear communication and honest documentation.'],
            ].map(([Icon, title, copy], index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-lg border border-slate-200 p-6 shadow-sm"
              >
                <Icon className="text-gold" size={34} />
                <h3 className="mt-4 text-lg font-bold text-royal-navy">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-royal-light">
        <div className="container-page">
          <h2 className="section-title">Export Countries</h2>
          <p className="section-copy">
            Serving buyers and trade partners across established and emerging import markets.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {countries.slice(0, 6).map((market, index) => (
              <CountryCard key={market.country} market={market} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page">
          <h2 className="section-title">Certification & Compliance</h2>
          <p className="section-copy">
            Built around reliable quality practices and shipment-ready documentation.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {certifications.map((certification, index) => (
              <CertificationCard
                key={certification.title}
                certification={certification}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-royal-blue py-14 text-white">
        <div className="container-page flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold">Ready to start your next export order?</h2>
            <p className="mt-3 max-w-2xl text-blue-100">
              Share your product requirement, destination country, and packing needs. Our team will
              respond with the right trade guidance.
            </p>
          </div>
          <Link to="/contact" className="btn-secondary shrink-0">
            Contact Us <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <ExportProcess />
      <Testimonials />
      <CertificationSlider />
      <Newsletter />

      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onInquiry={handleSendInquiry}
      />
      <ProductCompareBar products={compareProducts} onClear={() => setCompareProducts([])} />
    </>
  );
}
