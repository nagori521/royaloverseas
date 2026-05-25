import { Mail } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="bg-royal-blue py-12 text-white">
      <div className="container-page flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold">Subscribe for export updates</h2>
          <p className="mt-2 text-blue-100">Product availability, packaging news, and market updates.</p>
        </div>
        <form className="flex w-full max-w-xl flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
          <input type="email" placeholder="Email address" className="min-h-12 flex-1 rounded-md px-4 text-slate-900 outline-none" />
          <button className="btn-secondary bg-white" type="submit">
            <Mail size={18} /> Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
