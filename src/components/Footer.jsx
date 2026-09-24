import React from 'react';
import { Phone, Mail, MapPin, Clock, Droplet, ShieldCheck, Award } from 'lucide-react';

export default function Footer({ setCurrentPage, openQuoteModal }) {
  const handleNavClick = (id) => {
    setCurrentPage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="footer-logo">
              <div className="logo-icon" style={{ width: 36, height: 36 }}>
                <Droplet size={22} />
              </div>
              <span>Pure Plomberie Inc</span>
            </div>
            <p className="footer-desc">
              Greater Montreal’s premier master plumbing specialists. Delivering fast, reliable, 
              and 100% clean residential and commercial plumbing services for over 15 years.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <span className="badge badge-primary" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--cyan-400)', borderColor: 'rgba(255,255,255,0.15)' }}>
                <ShieldCheck size={14} /> RBQ: 5689-1234-01
              </span>
              <span className="badge badge-primary" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--cyan-400)', borderColor: 'rgba(255,255,255,0.15)' }}>
                <Award size={14} /> CMMTQ Member
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>Home</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services'); }}>Our Services</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>About Pure Plomberie</a></li>
              <li><a href="#gallery" onClick={(e) => { e.preventDefault(); handleNavClick('gallery'); }}>Project Gallery</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>Contact & Location</a></li>
              <li><a href="#quote" onClick={(e) => { e.preventDefault(); openQuoteModal(); }}>Get Free Quote</a></li>
            </ul>
          </div>

          {/* Plumbing Services */}
          <div>
            <h4 className="footer-heading">Our Services</h4>
            <ul className="footer-links">
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services'); }}>Leak Detection & Repair</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services'); }}>Hydro-Jet Drain Cleaning</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services'); }}>Tankless Water Heaters</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services'); }}>24/7 Emergency Plumbing</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services'); }}>Pipe Replacement & Re-piping</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('services'); }}>Bathroom & Kitchen Plumbing</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="footer-heading">Contact & Hours</h4>
            <ul className="footer-links" style={{ gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--cyan-400)', flexShrink: 0, marginTop: 3 }} />
                <span>1450 Rue Peel, Suite 400<br />Montréal, QC H3A 1T1</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={18} style={{ color: 'var(--cyan-400)', flexShrink: 0 }} />
                <a href="tel:5145557873" style={{ fontWeight: 700, color: 'var(--white)' }}>(514) 555-PURE (7873)</a>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={18} style={{ color: 'var(--cyan-400)', flexShrink: 0 }} />
                <span>info@pureplomberie.ca</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Clock size={18} style={{ color: 'var(--amber-500)', flexShrink: 0 }} />
                <span style={{ color: 'var(--amber-500)', fontWeight: 600 }}>24/7 Emergency Dispatch</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom with Watermark */}
        <div className="footer-bottom">
          <div>
            <p>© {new Date().getFullYear()} Pure Plomberie Inc. All Rights Reserved. Master Plumbing Licence RBQ 5689-1234-01.</p>
            <div className="watermark-credit">
              Created by{' '}
              <span 
                className="watermark-author-link" 
                onClick={() => handleNavClick('admin')}
                title="Admin Portal"
              >
                Ghazanfar
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <a href="#sitemap" onClick={(e) => e.preventDefault()}>Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
