import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search } from 'lucide-react';
import { jsPDF } from 'jspdf';
import InquiryModal from '../components/InquiryModal.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductTabs from '../components/ProductTabs.jsx';
import ProductQuickView from '../components/ProductQuickView.jsx';
import ProductCompareBar from '../components/ProductCompareBar.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { products as seedProducts } from '../data.js';
import { api } from '../services/api.js';
import { normalizeProduct } from '../utils/normalize.js';

const applyProductFilters = (items, activeCategory, search) => {
  const query = search.trim().toLowerCase();

  return items.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const searchText = [
      product.name,
      product.title,
      product.category,
      product.description,
      product.packaging,
    ].filter(Boolean).join(' ').toLowerCase();
    const matchesSearch = !query || searchText.includes(query);

    return matchesCategory && matchesSearch;
  });
};

const formatValue = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return value || 'Not specified';
};

const imageToDataUrl = async (src) => {
  if (!src) return null;

  try {
    const response = await fetch(src);
    if (!response.ok) return null;

    const blob = await response.blob();

    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const imageFormat = (dataUrl) => {
  if (dataUrl?.startsWith('data:image/png')) return 'PNG';
  if (dataUrl?.startsWith('data:image/webp')) return 'WEBP';
  return 'JPEG';
};

const addWrappedLabel = (doc, label, value, x, y, maxWidth) => {
  doc.setFont('helvetica', 'bold');
  doc.text(`${label}:`, x, y);
  doc.setFont('helvetica', 'normal');
  const labelWidth = doc.getTextWidth(`${label}: `);
  const lines = doc.splitTextToSize(formatValue(value), maxWidth - labelWidth);
  doc.text(lines, x + labelWidth, y);
  return y + Math.max(lines.length, 1) * 6;
};

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(seedProducts);
  const [isGeneratingCatalog, setIsGeneratingCatalog] = useState(false);

  useEffect(() => {
    api.products()
      .then((items) => setProducts(items.map(normalizeProduct)))
      .catch(() => setProducts(seedProducts));
  }, []);

  const filteredProducts = useMemo(
    () => applyProductFilters(products, activeCategory, search),
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

  const handleCatalogDownload = async () => {
    if (isGeneratingCatalog) return;

    setIsGeneratingCatalog(true);

    try {
      const latestProducts = await api.products()
        .then((items) => items.map(normalizeProduct))
        .catch(() => []);
      setProducts(latestProducts);
      const catalogProducts = applyProductFilters(latestProducts, activeCategory, search);
      const catalogTitle = activeCategory === 'All'
        ? 'Royal Overseas Product Catalog'
        : `Royal Overseas ${activeCategory} Catalog`;
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const imageSize = 36;
      let y = 20;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(catalogTitle, pageWidth / 2, y, { align: 'center' });
      y += 14;

      if (!catalogProducts.length) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text('No products available', margin, y);
        doc.save('Royal-Overseas-Catalog.pdf');
        return;
      }

      doc.setFontSize(10);

      for (const product of catalogProducts) {
        if (y > pageHeight - 70) {
          doc.addPage();
          y = 18;
        }

        const cardTop = y;
        const textX = margin + imageSize + 8;
        const textWidth = pageWidth - textX - margin;
        const imageData = await imageToDataUrl(product.image);

        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, cardTop - 5, pageWidth - margin * 2, 58, 2, 2);

        if (imageData) {
          try {
            doc.addImage(imageData, imageFormat(imageData), margin + 3, cardTop, imageSize, imageSize);
          } catch {
            doc.setFillColor(241, 245, 249);
            doc.rect(margin + 3, cardTop, imageSize, imageSize, 'F');
            doc.setTextColor(100, 116, 139);
            doc.text('Image unavailable', margin + 6, cardTop + 19);
            doc.setTextColor(15, 23, 42);
          }
        } else {
          doc.setFillColor(241, 245, 249);
          doc.rect(margin + 3, cardTop, imageSize, imageSize, 'F');
          doc.setTextColor(100, 116, 139);
          doc.text('Image unavailable', margin + 6, cardTop + 19);
          doc.setTextColor(15, 23, 42);
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(formatValue(product.title || product.name), textX, cardTop + 1);
        doc.setFontSize(9);
        let textY = cardTop + 9;
        textY = addWrappedLabel(doc, 'Category', product.category, textX, textY, textWidth);
        textY = addWrappedLabel(doc, 'Description', product.description, textX, textY, textWidth);
        textY = addWrappedLabel(doc, 'Packaging', product.packaging || product.packagingSizes, textX, textY, textWidth);
        addWrappedLabel(doc, 'MOQ', product.moq, textX, textY, textWidth);

        y += 66;
      }

      doc.save('Royal-Overseas-Catalog.pdf');
    } finally {
      setIsGeneratingCatalog(false);
    }
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
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCatalogDownload}
                disabled={isGeneratingCatalog}
              >
                <Download size={18} />
                {isGeneratingCatalog ? 'Generating catalog...' : 'PDF Catalog'}
              </button>
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
