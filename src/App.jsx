import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import { CheckCircle2 } from 'lucide-react';
import './App.css';

export default function App() {
  // Read current page from URL pathname or hash (e.g. /admin, #admin)
  const getPageFromUrl = () => {
    const path = window.location.pathname.replace(/^\//, '').toLowerCase().split('/')[0];
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().split('/')[0];
    const validPages = ['services', 'about', 'gallery', 'contact', 'admin'];
    
    if (validPages.includes(path)) return path;
    if (validPages.includes(hash)) return hash;
    return 'home';
  };

  const [currentPage, setCurrentPageState] = useState(getPageFromUrl);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state with browser navigation
  const setCurrentPage = (page) => {
    setCurrentPageState(page);
    const targetUrl = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ page }, '', targetUrl);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPageState(getPageFromUrl());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'services':
        return <ServicesPage openQuoteModal={() => setIsQuoteModalOpen(true)} />;
      case 'about':
        return <AboutPage openQuoteModal={() => setIsQuoteModalOpen(true)} />;
      case 'gallery':
        return <GalleryPage openQuoteModal={() => setIsQuoteModalOpen(true)} />;
      case 'contact':
        return <ContactPage showToast={showToast} />;
      case 'admin':
        return <AdminPage />;
      case 'home':
      default:
        return (
          <HomePage 
            setCurrentPage={setCurrentPage} 
            openQuoteModal={() => setIsQuoteModalOpen(true)} 
          />
        );
    }
  };

  return (
    <div className="app-root">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        openQuoteModal={() => setIsQuoteModalOpen(true)} 
      />

      {renderPage()}

      <Footer 
        setCurrentPage={setCurrentPage} 
        openQuoteModal={() => setIsQuoteModalOpen(true)} 
      />

      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        showToast={showToast} 
      />

      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={22} color="var(--cyan-400)" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
