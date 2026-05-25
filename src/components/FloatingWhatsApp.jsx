import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919909582400?text=Hello%20Royal%20Overseas,%20I%20am%20interested%20in%20your%20products."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-soft transition hover:scale-105"
      aria-label="WhatsApp inquiry"
    >
      <MessageCircle size={26} />
    </a>
  );
}
