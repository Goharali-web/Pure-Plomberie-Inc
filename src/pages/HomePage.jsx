import React, { useState } from 'react';
import { 
  Wrench, ShieldCheck, Clock, Award, Phone, ArrowRight, 
  Droplets, Flame, Waves, CheckCircle2, Star, ThumbsUp, DollarSign, PenTool
} from 'lucide-react';

export default function HomePage({ setCurrentPage, openQuoteModal }) {
  const [quickService, setQuickService] = useState('leak');
  const [quickType, setQuickType] = useState('home');

  const getQuickPrice = () => {
    let p = 160;
    if (quickService === 'drain') p = 190;
    if (quickService === 'heater') p = 480;
    if (quickService === 'emergency') p = 260;
    if (quickType === 'commercial') p *= 1.35;
    return Math.round(p);
  };

  const servicesList = [
    {
      id: 'leak',
      title: 'Leak Detection & Repair',
      icon: <Droplets size={28} />,
      desc: 'Non-invasive sonic acoustic leak detection and rapid pipe repair to prevent water damage to your property.',
    },
    {
      id: 'drain',
      title: 'Hydro-Jet Drain Cleaning',
      icon: <Waves size={28} />,
      desc: 'High-pressure commercial jetting clears severe grease, tree roots, and stubborn blockages with video camera inspection.',
    },
    {
      id: 'heater',
      title: 'Water Heater Systems',
      icon: <Flame size={28} />,
      desc: 'Tankless & high-efficiency water heater installation, maintenance, and emergency element repairs.',
    },
    {
      id: 'emergency',
      title: '24/7 Emergency Plumbing',
      icon: <Clock size={28} />,
      desc: 'Immediate 30-minute response dispatch for burst pipes, sewage backups, and major water shutoff emergencies.',
    }
  ];

  const whyChooseUs = [
    {
      icon: <DollarSign size={28} />,
      title: '100% Upfront Pricing',
      desc: 'No hidden fees or surprises. You approve the flat-rate price quote before any work begins.'
    },
    {
      icon: <Clock size={28} />,
      title: 'Rapid 30-Min Dispatch',
      desc: 'Fully equipped mobile units on standby across Greater Montreal for immediate emergency service.'
    },
    {
      icon: <ShieldCheck size={28} />,
      title: 'Master Licensed Plumbers',
      desc: 'Certified RBQ & CMMTQ professionals with rigorous safety and local building code compliance.'
    },
    {
      icon: <ThumbsUp size={28} />,
      title: 'Clean Work Guarantee',
      desc: 'We wear shoe covers, protect your flooring, and leave your residence spotlessly clean after job completion.'
    }
  ];

  const testimonials = [
    {
      name: 'Marc-André Tremblay',
      location: 'Outremont, Montreal',
      text: 'Pure Plomberie responded to our midnight burst pipe within 25 minutes. The plumber was polite, professional, and solved the issue cleanly. Highly recommended!',
      rating: 5
    },
    {
      name: 'Sophie Laurent',
      location: 'Westmount',
      text: 'Upgraded our entire home to a tankless hot water system. Excellent advice, super neat copper work, and clear upfront pricing. Best plumbing team in QC.',
      rating: 5
    },
    {
      name: 'David Greenberg',
      location: 'Downtown Montreal',
      text: 'Their hydro-jet drain cleaning saved our restaurant kitchen during peak weekend hours. Fast, transparent, and completely resolved our main drain backup.',
      rating: 5
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="animate-fade-in">
              <div className="hero-badge-wrap">
                <span className="badge badge-emergency pulse-emergency">
                  <Clock size={16} /> 24/7 Emergency Plumbing On Call
                </span>
              </div>
              <h1 className="hero-title">
                Reliable Plumbing Services <span>Without Compromise.</span>
              </h1>
              <p className="hero-subtitle">
                Montreal's trusted master plumbers for 15+ years. From leak repairs and high-pressure drain cleaning 
                to water heaters — we deliver fast, certified, 100% clean solutions.
              </p>

              <div className="hero-cta-group">
                <button className="btn btn-primary" onClick={openQuoteModal}>
                  Get a Free Quote <ArrowRight size={18} />
                </button>
                <a href="tel:5145557873" className="btn btn-emergency">
                  <Phone size={18} /> (514) 555-PURE
                </a>
              </div>

              <div className="hero-trust-badges">
                <div className="trust-item">
                  <CheckCircle2 size={18} />
                  <span>Licensed & Insured</span>
                </div>
                <div className="trust-item">
                  <CheckCircle2 size={18} />
                  <span>Flat-Rate Pricing</span>
                </div>
                <div className="trust-item">
                  <CheckCircle2 size={18} />
                  <span>100% Clean Guarantee</span>
                </div>
              </div>
            </div>

            <div className="hero-image-card animate-fade-in">
              <img src="/assets/images/hero_plumber.jpg" alt="Pure Plomberie Master Plumber at work" />
              <div className="hero-floating-badge">
                <div className="badge-counter">4.9 ★</div>
                <div className="badge-text">
                  Over 1,200+ Verified<br />5-Star Local Reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Quote Estimator Section */}
      <section className="container quote-estimator-section">
        <div className="estimator-card">
          <div className="estimator-header">
            <div>
              <h3 style={{ fontSize: '1.3rem' }}>Quick Price Estimator</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)' }}>Select your scenario for an instant estimated cost range</p>
            </div>
            <span className="badge badge-primary">Instant Estimate</span>
          </div>

          <div className="estimator-grid">
            <div className="form-group">
              <label>Service Category</label>
              <select value={quickService} onChange={(e) => setQuickService(e.target.value)} className="form-select">
                <option value="leak">Leak Detection & Repair</option>
                <option value="drain">Hydro-Jet Drain Cleaning</option>
                <option value="heater">Water Heater Installation</option>
                <option value="emergency">24/7 Emergency Plumbing</option>
              </select>
            </div>

            <div className="form-group">
              <label>Property Type</label>
              <select value={quickType} onChange={(e) => setQuickType(e.target.value)} className="form-select">
                <option value="home">Residential (House/Condo)</option>
                <option value="commercial">Commercial / Restaurant</option>
              </select>
            </div>

            <div className="estimator-result">
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Est. Starting From</div>
              <div className="result-price">${getQuickPrice()}</div>
            </div>

            <div>
              <button className="btn btn-primary" onClick={openQuoteModal} style={{ width: '100%' }}>
                Book This Estimate
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="container section-padding" style={{ paddingTop: '1rem' }}>
        <div className="text-center" style={{ maxWidth: 640, margin: '0 auto 1.5rem auto' }}>
          <span className="badge badge-primary">What We Do</span>
          <h2 style={{ fontSize: '2.4rem', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
            Comprehensive Plumbing Solutions
          </h2>
          <p style={{ color: 'var(--slate-600)' }}>
            We handle everything from simple household leak repairs to complex commercial repiping and water heater replacements.
          </p>
        </div>

        <div className="services-grid">
          {servicesList.map((svc) => (
            <div key={svc.id} className="service-card">
              <div className="service-icon-wrap">{svc.icon}</div>
              <h3 className="service-title">{svc.title}</h3>
              <p className="service-desc">{svc.desc}</p>
              <button 
                className="service-link"
                onClick={() => setCurrentPage('services')}
              >
                Learn More <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: '2.5rem' }}>
          <button className="btn btn-outline" onClick={() => setCurrentPage('services')}>
            View All 6 Plumbing Services →
          </button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-section section-padding">
        <div className="container">
          <div className="text-center" style={{ maxWidth: 640, margin: '0 auto 2rem auto' }}>
            <span className="badge badge-emergency" style={{ background: 'rgba(245,158,11,0.2)', color: 'var(--amber-500)' }}>
              The Pure Plomberie Difference
            </span>
            <h2 style={{ color: 'var(--white)', fontSize: '2.4rem', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
              Why Homeowners Trust Us
            </h2>
            <p style={{ color: 'var(--slate-300)' }}>
              We build long-term relationships with clean craftsmanship, honest advice, and fixed pricing.
            </p>
          </div>

          <div className="why-grid">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="why-card">
                <div className="why-icon-box">{item.icon}</div>
                <h3 className="why-title">{item.title}</h3>
                <p className="why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container section-padding">
        <div className="text-center" style={{ maxWidth: 640, margin: '0 auto' }}>
          <span className="badge badge-primary">Testimonials</span>
          <h2 style={{ fontSize: '2.4rem', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
            What Our Clients Say
          </h2>
          <p style={{ color: 'var(--slate-600)' }}>
            Real reviews from real homeowners and business managers across Greater Montreal.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="rating-stars">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="var(--amber-500)" color="var(--amber-500)" />
                ))}
              </div>
              <p className="testimonial-quote">"{t.text}"</p>
              <div className="client-info">
                <div className="client-avatar">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="client-name">{t.name}</div>
                  <div className="client-location">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Callout Banner */}
      <section style={{ background: 'linear-gradient(135deg, var(--blue-600), var(--navy-900))', color: 'var(--white)', padding: '4rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h2 style={{ color: 'var(--white)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
              Have a Plumbing Emergency or Project?
            </h2>
            <p style={{ color: 'var(--slate-200)', fontSize: '1.1rem' }}>
              Our master plumbers are standing by 24/7 across Montreal. Call now or request a free quote online.
            </p>
          </div>
          <div className="banner-cta-group">
            <button className="btn btn-white" onClick={openQuoteModal}>
              Get a Free Quote
            </button>
            <a href="tel:5145557873" className="btn btn-emergency">
              <Phone size={18} /> Call (514) 555-7873
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
