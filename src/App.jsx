import React, { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState('home');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

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
