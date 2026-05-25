import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
      {items.map(([label, to], index) => (
        <span key={to || label} className="flex items-center gap-2">
          {to && index < items.length - 1 ? (
            <Link to={to} className="text-royal-blue hover:text-gold">
              {label}
            </Link>
          ) : (
            <span>{label}</span>
          )}
          {index < items.length - 1 && <ChevronRight size={16} />}
        </span>
      ))}
    </nav>
  );
}
