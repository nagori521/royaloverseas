import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle({ dark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-royal-navy transition hover:border-gold dark:border-white/15 dark:text-white"
      aria-label="Toggle dark mode"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
