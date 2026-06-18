import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api.js';

export default function ContactForm() {
  const location = useLocation();
  const [status, setStatus] = useState('');
  const defaultSubject = location.state?.productName || 'General Export Inquiry';
  const submitForm = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await api.createInquiry({
        customerName: formData.get('customerName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        product: formData.get('subject') || 'General Export Inquiry',
        message: formData.get('message'),
      });
      setStatus('Inquiry submitted successfully.');
      event.currentTarget.reset();
    } catch {
      setStatus('Inquiry preview created. Start backend to store it in MongoDB.');
    }
  };

  return (
    <motion.form
      id="inquiry-form"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft"
      onSubmit={submitForm}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          ['Name', 'customerName', 'text'],
          ['Email', 'email', 'email'],
          ['Phone', 'phone', 'tel'],
          ['Country', 'country', 'text'],
          ['Subject', 'subject', 'text'],
        ].map(([label, name, type]) => (
          <label
            key={label}
            className={`grid gap-2 text-sm font-semibold text-slate-700 ${
              label === 'Subject' ? 'sm:col-span-2' : ''
            }`}
          >
            {label}
            <input
              name={name}
              type={type}
              required
              defaultValue={label === 'Subject' ? defaultSubject : undefined}
              className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue"
            />
          </label>
        ))}
      </div>
      <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
        Message
        <textarea
          name="message"
          rows="6"
          required
          className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue"
        />
      </label>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn-primary">
          <Send size={18} />
          Submit Inquiry
        </button>
        <a
          href="https://wa.me/916359578922?text=Hello%20Royal%20Overseas,%20I%20am%20interested%20in%20your%20products."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          <MessageCircle size={18} />
          WhatsApp Inquiry
        </a>
      </div>
      {status && <p className="mt-4 rounded-md bg-royal-light p-3 text-sm font-semibold text-royal-blue">{status}</p>}
    </motion.form>
  );
}
