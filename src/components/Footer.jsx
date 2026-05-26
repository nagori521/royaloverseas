import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const quickLinks = [
  ['Home', '/'],
  ['About', '/about'],
  ['Products', '/products'],
  ['Export Markets', '/export-markets'],
  ['Gallery', '/gallery'],
  ['Contact', '/contact'],
];

export default function Footer() {
  return (
    <footer className="bg-royal-navy text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <h2 className="text-2xl font-bold">Royal Overseas</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-blue-100">
            Import export partner for quality products, dependable documentation, and global
            shipment coordination.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Instagram, Linkedin].map((Icon, index) => (
              <a
                key={index}
                href="#"
                aria-label="Social profile"
                className="grid h-10 w-10 place-items-center rounded-md border border-white/20 text-white transition hover:border-gold hover:text-gold"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gold">Quick Links</h3>
          <div className="mt-4 grid gap-2">
            {quickLinks.map(([label, to]) => (
              <Link key={to} to={to} className="text-sm text-blue-100 transition hover:text-gold">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gold">Contact Info</h3>
          <div className="mt-4 grid gap-3 text-sm text-blue-100">
            <span className="flex items-start gap-3">
              <MapPin className="mt-0.5 shrink-0 text-gold" size={18} />
              Royal Overseas Trade Office, Ahmedabad, India
            </span>
            <span className="flex items-center gap-3">
              <Phone className="shrink-0 text-gold" size={18} />
              +91 99095 82400
            </span>
            <span className="flex items-center gap-3">
              <Mail className="shrink-0 text-gold" size={18} />
              info@royaloverseas.com
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-blue-100">
        Copyright © {new Date().getFullYear()} Royal Overseas. All rights reserved.
      </div>
    </footer>
  );
}
