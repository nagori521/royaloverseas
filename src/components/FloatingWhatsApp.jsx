import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/?text=Hello Royal Overseas, I want to discuss an export inquiry."
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-24 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-soft transition hover:scale-105"
      aria-label="WhatsApp inquiry"
    >
      <MessageCircle size={26} />
    </a>
  );
}
