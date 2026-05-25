import { languages } from '../i18n/languages.js';

export default function LanguageSelector() {
  return (
    <select
      className="h-10 rounded-md border border-slate-200 bg-white px-2 text-sm font-bold text-royal-navy outline-none dark:border-white/15 dark:bg-slate-900 dark:text-white"
      defaultValue="en"
      aria-label="Language"
    >
      {Object.entries(languages).map(([code, language]) => (
        <option key={code} value={code}>
          {language.label}
        </option>
      ))}
    </select>
  );
}
