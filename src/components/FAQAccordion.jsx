import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What products do you export?',
    answer:
      'We export rice, spices, detergent products, and customized packaged goods based on buyer requirements.',
  },
  {
    question: 'Which countries do you serve?',
    answer:
      'We support export inquiries across the Middle East, Europe, North America, and Asia Pacific markets.',
  },
  {
    question: 'How can I request quotation?',
    answer:
      'Use the inquiry form, WhatsApp button, or product inquiry popup with product name, country, and quantity.',
  },
  {
    question: 'MOQ details?',
    answer:
      'MOQ depends on the product category. Rice and detergent usually start from 1 metric ton, while spices can start from 500kg.',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="grid gap-3">
      {faqs.map((faq, index) => (
        <div key={faq.question} className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-royal-navy"
          >
            {faq.question}
            <ChevronDown
              size={20}
              className={`shrink-0 transition ${openIndex === index ? 'rotate-180 text-gold' : ''}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
