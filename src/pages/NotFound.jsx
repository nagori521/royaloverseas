import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-slate-50 px-4 py-16 text-center">
      <SEO title="404 | Royal Overseas" description="Page not found on Royal Overseas." />
      <div>
        <div className="text-7xl font-bold text-gold">404</div>
        <h1 className="mt-4 text-4xl font-bold text-royal-navy">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          The page you are looking for may have moved or does not exist.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
