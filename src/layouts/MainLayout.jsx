import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FloatingWhatsApp from '../components/FloatingWhatsApp.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import StickyInquiryButton from '../components/StickyInquiryButton.jsx';

export default function MainLayout() {
  const [dark, setDark] = useState(localStorage.getItem('royalTheme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('royalTheme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <LoadingScreen />
      <Navbar dark={dark} onToggleDark={() => setDark((value) => !value)} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <StickyInquiryButton />
    </div>
  );
}
