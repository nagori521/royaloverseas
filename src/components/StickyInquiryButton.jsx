import { Link } from 'react-router-dom';

export default function StickyInquiryButton() {
  return (
    <Link
      to="/contact"
      className="fixed bottom-5 right-5 z-40 rounded-full bg-gold px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-royal-blue"
    >
      Send Inquiry
    </Link>
  );
}
