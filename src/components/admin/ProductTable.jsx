import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-royal-light text-xs uppercase tracking-wide text-royal-navy">
            <tr>
              {['Image', 'Name', 'Category', 'Packaging', 'Status', 'Actions'].map((head) => (
                <th key={head} className="px-5 py-4 font-bold">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const productId = product.id || product._id;
              return (
              <tr key={productId} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <img src={product.image} alt={product.name} className="h-14 w-16 rounded-md object-cover" />
                </td>
                <td className="px-5 py-4 font-bold text-royal-navy">{product.name}</td>
                <td className="px-5 py-4">{product.category}</td>
                <td className="px-5 py-4 min-w-64">{product.packaging}</td>
                <td className="px-5 py-4">
                  <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Active
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Link className="rounded-md border border-slate-200 p-2 text-royal-blue" to={`/products/${productId}`}>
                      <Eye size={17} />
                    </Link>
                    <button className="rounded-md border border-slate-200 p-2 text-gold" onClick={() => onEdit(product)}>
                      <Pencil size={17} />
                    </button>
                    <button className="rounded-md border border-slate-200 p-2 text-red-600" onClick={() => onDelete(productId)}>
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
