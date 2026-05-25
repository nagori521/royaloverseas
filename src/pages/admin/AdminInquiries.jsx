import { useEffect, useState } from 'react';
import { Eye, Mail, Trash2, X } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import { inquiries as seedInquiries } from '../../data.js';
import { api } from '../../services/api.js';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState(seedInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = () => api.inquiries().then(setInquiries).catch(() => {});

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (inquiry, status) => {
    const id = inquiry.id || inquiry._id;
    try {
      const updated = await api.updateInquiryStatus(id, status);
      setInquiries((items) =>
        items.map((item) => ((item.id || item._id) === id ? updated : item))
      );
      setSelectedInquiry((current) =>
        current && (current.id || current._id) === id ? updated : current
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <section className="p-5 sm:p-8">
      <AdminPageHeader title="Inquiry Management" subtitle="Track buyer inquiries and response status." />
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-royal-light text-xs uppercase tracking-wide text-royal-navy">
              <tr>
                {['Customer Name', 'Country', 'Product', 'Email', 'Status', 'Actions'].map((head) => (
                  <th key={head} className="px-5 py-4">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-royal-navy">{inquiry.name || inquiry.customerName}</td>
                  <td className="px-5 py-4">{inquiry.country}</td>
                  <td className="px-5 py-4">{inquiry.product}</td>
                  <td className="px-5 py-4">{inquiry.email}</td>
                  <td className="px-5 py-4">
                    <select
                      value={inquiry.status}
                      onChange={(event) => updateStatus(inquiry, event.target.value)}
                      className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold"
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-md border border-slate-200 p-2 text-royal-blue"
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        <Eye size={17} />
                      </button>
                      <a
                        className="rounded-md border border-slate-200 p-2 text-gold"
                        href={`mailto:${inquiry.email}`}
                      >
                        <Mail size={17} />
                      </a>
                      <button className="rounded-md border border-slate-200 p-2 text-red-600" onClick={() => {
                        const id = inquiry.id || inquiry._id;
                        api.deleteInquiry(id).then(() => {
                          setInquiries((items) => items.filter((item) => (item.id || item._id) !== id));
                          if ((selectedInquiry?.id || selectedInquiry?._id) === id) setSelectedInquiry(null);
                        }).catch(() => {});
                      }}><Trash2 size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedInquiry && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-royal-navy/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-bold text-royal-navy">Inquiry Details</h2>
              <button
                type="button"
                className="rounded-md border border-slate-200 p-2 text-slate-600"
                onClick={() => setSelectedInquiry(null)}
              >
                <X size={20} />
              </button>
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ['Name', selectedInquiry.name || selectedInquiry.customerName],
                ['Email', selectedInquiry.email],
                ['Phone', selectedInquiry.phone],
                ['Product', selectedInquiry.product],
                ['Status', selectedInquiry.status],
                [
                  'Date',
                  selectedInquiry.createdAt
                    ? new Date(selectedInquiry.createdAt).toLocaleString()
                    : selectedInquiry.date || '-',
                ],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-slate-50 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt>
                  <dd className="mt-1 font-semibold text-royal-navy">{value || '-'}</dd>
                </div>
              ))}
              <div className="rounded-md bg-slate-50 p-4 sm:col-span-2">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Message</dt>
                <dd className="mt-1 leading-7 text-slate-700">{selectedInquiry.message || '-'}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </section>
  );
}
