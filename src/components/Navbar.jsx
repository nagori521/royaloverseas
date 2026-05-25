import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, ShipWheel, X } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle.jsx';
import LanguageSelector from './LanguageSelector.jsx';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
  { label: 'Export Markets', to: '/export-markets' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar({ dark, onToggleDark }) {
  const [open, setOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-royal-light text-royal-blue'
        : 'text-slate-700 hover:bg-slate-100 hover:text-royal-blue'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/95">
      <nav className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-11 w-11 place-items-center rounded-md bg-royal-blue text-white">
            <ShipWheel size={24} />
          </span>
          <span>
            <span className="block text-xl font-bold text-royal-navy dark:text-white">Royal Overseas</span>
            <span className="block text-xs font-semibold uppercase tracking-wide text-gold">
              Import Export
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
          <LanguageSelector />
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSelector />
          <DarkModeToggle dark={dark} onToggle={onToggleDark} />
          <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-md border border-slate-200 text-royal-navy lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page grid gap-2 py-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navClass}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
