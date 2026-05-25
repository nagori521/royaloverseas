import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search } from 'lucide-react';
import InquiryModal from '../components/InquiryModal.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductTabs from '../components/ProductTabs.jsx';
import ProductQuickView from '../components/ProductQuickView.jsx';
import ProductCompareBar from '../components/ProductCompareBar.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { products as seedProducts } from '../data.js';
import { api } from '../services/api.js';
import { normalizeProduct } from '../utils/normalize.js';

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(seedProducts);

  useEffect(() => {
    api.products()
      .then((items) => setProducts(items.map(normalizeProduct)))
      .catch(() => setProducts(seedProducts));
  }, []);

  const filteredProducts = useMemo(
    () => products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const searchText = [
        product.name,
        product.title,
        product.category,
        product.description,
        product.packaging,
      ].filter(Boolean).join(' ').toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    }),
    [activeCategory, products, search],
  );

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))],
    [products],
  );

  const toggleCompare = (product) => {
    setCompareProducts((items) =>
      items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items.slice(-2), product],
    );
  };

  return (
    <>
      <section className="bg-royal-blue py-16 text-white sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          className="container-page text-center"
        >
          <h1 className="text-4xl font-bold sm:text-5xl">Our Export Products</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-blue-100">
            Premium quality products exported worldwide.
          </p>
        </motion.div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-page">
          <Breadcrumbs items={[['Home', '/'], ['Products', '/products']]} />
          <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <ProductTabs activeCategory={activeCategory} onChange={setActiveCategory} categories={categories} />
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products"
                  className="w-full rounded-md border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-royal-blue sm:w-72"
                />
              </label>
              <a href="/Royal-Overseas-Catalog.pdf" download className="btn-secondary">
                <Download size={18} />
                PDF Catalog
              </a>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onInquiry={setSelectedProduct}
                onQuickView={setQuickViewProduct}
                onCompare={toggleCompare}
                compareActive={compareProducts.some((item) => item.id === product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <InquiryModal
        product={selectedProduct}
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onInquiry={setSelectedProduct}
      />
      <ProductCompareBar products={compareProducts} onClear={() => setCompareProducts([])} />
    </>
  );
}
