import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import { customers } from '../../data.js';

export default function AdminCustomers() {
  return (
    <section className="p-5 sm:p-8">
      <AdminPageHeader title="Customer Management" subtitle="Buyer records and contact information." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer) => (
          <article key={customer.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-royal-navy">{customer.name}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">{customer.country}</p>
            <div className="mt-5 rounded-md bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-500">Products</p>
              <p className="mt-1 font-semibold text-royal-navy">{customer.products}</p>
            </div>
            <p className="mt-4 text-sm text-slate-600">{customer.contact}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
