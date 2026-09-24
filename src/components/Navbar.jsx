import React, { useState } from 'react';
import { Phone, Droplet, Menu, X, ShieldCheck, Clock, Award } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage, openQuoteModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About Us' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Ticker Notification Bar */}
      <div className="top-ticker">
        <div className="container">
          <div className="ticker-content">
            <div className="ticker-left">
              <span className="ticker-item">
                <Clock size={14} className="ticker-highlight" />
                <span>24/7 Emergency Dispatch Available</span>
              </span>
              <span className="ticker-item" style={{ display: 'none', md: 'inline-flex' }}>
                <ShieldCheck size={14} className="ticker-highlight" />
                <span>RBQ Licence: 5689-1234-01 | CMMTQ Member</span>
              </span>
            </div>
            <div className="ticker-right">
              <span className="ticker-item">
                <Award size={14} className="ticker-highlight" />
                <span>15+ Years Master Plumbing Experience</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="site-header">
        <div className="container">
          <div className="header-container">
            {/* Logo */}
            <a 
              href="#home" 
              className="logo-brand" 
              onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
            >
              <div className="logo-icon">
                <Droplet size={26} />
              </div>
              <div>
                <span>Pure Plomberie</span>
                <span className="logo-tag">Master Plumbers</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav>
              <ul className="nav-links">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.id)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Header Action CTAs */}
            <div className="header-actions">
              <a href="tel:5145557873" className="phone-chip">
                <Phone size={18} style={{ color: 'var(--blue-600)' }} />
                <span>(514) 555-PURE</span>
              </a>
              <button 
                className="btn btn-primary header-quote-btn"
                onClick={openQuoteModal}
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
              >
                Get a Free Quote
              </button>
              <button 
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                style={{ textAlign: 'left', width: '100%', fontSize: '1.1rem', padding: '0.75rem 0' }}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <a href="tel:5145557873" className="btn btn-emergency" style={{ width: '100%' }}>
                <Phone size={18} /> Call Dispatch (514) 555-7873
              </a>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => { setMobileMenuOpen(false); openQuoteModal(); }}
              >
                Get a Free Quote
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
