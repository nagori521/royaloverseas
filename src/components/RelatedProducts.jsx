import ProductCard from './ProductCard.jsx';

export default function RelatedProducts({ products, onInquiry }) {
  if (!products.length) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} onInquiry={onInquiry} />
      ))}
    </div>
  );
}
