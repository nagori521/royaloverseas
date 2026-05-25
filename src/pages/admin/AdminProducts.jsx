import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import AddProductForm from '../../components/admin/AddProductForm.jsx';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import EditProductModal from '../../components/admin/EditProductModal.jsx';
import ProductTable from '../../components/admin/ProductTable.jsx';
import { products as seedProducts } from '../../data.js';
import { api } from '../../services/api.js';
import { normalizeProduct } from '../../utils/normalize.js';

export default function AdminProducts() {
  const [products, setProducts] = useState(seedProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');

  const fetchProducts = () => {
    return api.products()
      .then((items) => setProducts(items.map(normalizeProduct)))
      .catch(() => {});
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaved = (text) => {
    setShowForm(false);
    setEditingProduct(null);
    setMessage(text);
    fetchProducts();
  };

  return (
    <section className="p-5 sm:p-8">
      <AdminPageHeader
        title="Product Management"
        subtitle="Add, edit, delete, and view export products."
        action={
          <button type="button" className="btn-primary" onClick={() => setShowForm((value) => !value)}>
            <Plus size={18} />
            Add Product
          </button>
        }
      />
      {message && (
        <div className="mb-5 rounded-md bg-green-50 p-3 text-sm font-semibold text-green-800">
          {message}
        </div>
      )}
      {showForm && (
        <div className="mb-6">
          <AddProductForm onSave={() => handleSaved('Product saved successfully')} />
        </div>
      )}
      <ProductTable
        products={products}
        onEdit={setEditingProduct}
        onDelete={(id) => {
          api.deleteProduct(id)
            .then(() => {
              setProducts((items) => items.filter((item) => (item.id || item._id) !== id));
              setMessage('Product deleted successfully');
            })
            .catch((err) => {
              console.error('Failed to delete product:', err);
              setMessage('');
            });
        }}
      />
      <EditProductModal
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={() => handleSaved('Product updated successfully')}
      />
    </section>
  );
}
