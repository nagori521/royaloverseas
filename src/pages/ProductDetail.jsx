import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import InquiryModal from '../components/InquiryModal.jsx';
import ProductDetailHero from '../components/ProductDetailHero.jsx';
import ProductGallery from '../components/ProductGallery.jsx';
import RelatedProducts from '../components/RelatedProducts.jsx';
import { products as seedProducts } from '../data.js';
import { api } from '../services/api.js';
import { normalizeProduct } from '../utils/normalize.js';

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState(seedProducts);
  const [loading, setLoading] = useState(true);
  const product = products.find((item) => item.id === id);

  useEffect(() => {
    setLoading(true);
    api.products()
      .then((items) => setProducts(items.map(normalizeProduct)))
      .catch(() => setProducts(seedProducts))
      .finally(() => setLoading(false));
  }, []);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 3);
  }, [product, products]);

  if (!product && loading) {
    return <div className="container-page py-20">Loading...</div>;
  }

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const info = [
    ['Origin', product.origin],
    ['Quality Grade', product.qualityGrade],
    ['Packaging', product.packaging],
    ['Shipping Availability', product.shippingAvailability],
    ['MOQ', product.moq],
    ['Delivery Time', product.deliveryTime],
  ];

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-50 py-4">
        <div className="container-page flex flex-col gap-3">
          <Breadcrumbs items={[['Home', '/'], ['Products', '/products'], [product.name, `/products/${product.id}`]]} />
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-royal-blue hover:text-royal-navy"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>
        </div>
      </div>

      <ProductDetailHero product={product} onInquiry={setSelectedProduct} />

      <section className="section-padding bg-slate-50">
        <div className="container-page">
          <h2 className="section-title">Product Information</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {info.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gold">{label}</h3>
                <p className="mt-2 font-semibold leading-7 text-royal-navy">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page">
          <h2 className="section-title">Product Gallery</h2>
          <p className="section-copy">
            Product visuals for packaging, inspection, and trade presentation.
          </p>
          <div className="mt-10">
            <ProductGallery images={product.gallery} title={product.name} />
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-page">
          <h2 className="section-title">Related Products</h2>
          <p className="section-copy">Similar export products available from Royal Overseas.</p>
          <div className="mt-10">
            <RelatedProducts products={relatedProducts} onInquiry={setSelectedProduct} />
          </div>
        </div>
      </section>

      <InquiryModal
        product={selectedProduct}
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
