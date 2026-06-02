import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '../components/ContactForm.jsx';
import ContactInfoCard from '../components/ContactInfoCard.jsx';
import FAQAccordion from '../components/FAQAccordion.jsx';

export default function Contact() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash && !location.state?.scrollToInquiry) return;

    const scrollToForm = () => {
      const element = document.getElementById('inquiry-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    scrollToForm();
    const timer = window.setTimeout(scrollToForm, 200);
    return () => window.clearTimeout(timer);
  }, [location.hash, location.state]);

  return (
    <>
      <section className="bg-royal-blue py-16 text-white sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          className="container-page text-center"
        >
          <h1 className="text-4xl font-bold sm:text-5xl">Contact Royal Overseas</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-blue-100">
            Connect with us for export inquiries worldwide.
          </p>
        </motion.div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              [MapPin, 'Office Address', 'Royal Overseas Trade Office', 'Mumbai, India'],
              [Phone, 'Phone', '+91 98765 43210', 'Export inquiry desk'],
              [Mail, 'Email', 'info@royaloverseas.com', 'Response within 24 hours'],
              [Clock, 'Working Hours', 'Mon - Sat, 10 AM - 7 PM', 'India Standard Time'],
            ].map(([Icon, title, value, detail], index) => (
              <ContactInfoCard
                key={title}
                icon={Icon}
                title={title}
                value={value}
                detail={detail}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <h2 className="section-title">Send Export Inquiry</h2>
            <p className="section-copy">
              Share your product, destination country, quantity, packaging preference, and delivery
              timeline. Our team will respond with the next steps.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-page">
          <h2 className="section-title">Map Location</h2>
          <div className="mt-8 grid min-h-[340px] place-items-center rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="text-center">
              <MapPin className="mx-auto text-gold" size={42} />
              <h3 className="mt-4 text-2xl font-bold text-royal-navy">Google Map Placeholder</h3>
              <p className="mt-2 text-slate-600">Royal Overseas Trade Office, Mumbai, India</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-copy">
              Quick answers for buyers planning their first export order with Royal Overseas.
            </p>
          </div>
          <FAQAccordion />
        </div>
      </section>
    </>
  );
}
