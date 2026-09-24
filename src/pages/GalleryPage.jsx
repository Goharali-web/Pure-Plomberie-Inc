import React, { useState } from 'react';
import { Camera, Eye, X, CheckCircle2, ArrowRight } from 'lucide-react';

export default function GalleryPage({ openQuoteModal }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      category: 'water-heaters',
      categoryLabel: 'Water Heater',
      title: 'Tankless Continuous Water Heater Install',
      image: '/assets/images/water_heater.jpg',
      location: 'Outremont, QC',
      details: 'Replaced an old 60-gallon rusted electric water heater with an ultra-efficient wall-mounted continuous gas tankless system.',
      beforeText: 'Inefficient 60G electric tank leaking from base.',
      afterText: 'Clean wall installation with press-copper fittings and continuous hot water flow.'
    },
    {
      id: 2,
      category: 'bathroom',
      categoryLabel: 'Bathroom',
      title: 'Luxury Rain Shower & Custom Faucet Rough-In',
      image: '/assets/images/bathroom_plumbing.jpg',
      location: 'Westmount, QC',
      details: 'Complete master bathroom plumbing installation including rain shower valve rough-in, freestanding soaking tub drain, and marble vanity faucets.',
      beforeText: '1970s corroded galvanized piping and low water pressure.',
      afterText: 'Modern thermostatic pressure-balanced shower valve with custom PEX repiping.'
    },
    {
      id: 3,
      category: 'emergency',
      categoryLabel: 'Emergency',
      title: 'Main Line Copper Pipe Repair & Replacement',
      image: '/assets/images/hero_plumber.jpg',
      location: 'Downtown Montreal',
      details: 'Midnight emergency callout for a ruptured main basement line. Repaired and pressure tested within 90 minutes.',
      beforeText: 'Ruptured 1-inch copper pipe flooding basement utility room.',
      afterText: 'New heavy-duty Type L copper replacement with main shut-off ball valve upgrade.'
    },
    {
      id: 4,
      category: 'piping',
      categoryLabel: 'Piping',
      title: 'Whole-Home Galvanized to PEX Repiping',
      image: '/assets/images/hero_plumber.jpg',
      location: 'NDG, Montreal',
      details: 'Full residential pipe replacement eliminating brown water discoloration and restoring 100% full water pressure.',
      beforeText: 'Corroded 50-year old galvanized steel pipes with heavy mineral restriction.',
      afterText: 'Clean color-coded Uponor PEX-a piping system with lifetime warranty.'
    },
    {
      id: 5,
      category: 'water-heaters',
      categoryLabel: 'Water Heater',
      title: 'Commercial Dual Water Heater System',
      image: '/assets/images/water_heater.jpg',
      location: 'Plateau Mont-Royal',
      details: 'Installed dual high-output commercial water heating tanks for a busy restaurant kitchen.',
      beforeText: 'Insufficient hot water supply during peak dinner service.',
      afterText: 'Dual parallel system with recirculating pump delivering instant 140°F hot water.'
    },
    {
      id: 6,
      category: 'bathroom',
      categoryLabel: 'Bathroom',
      title: 'Modern Freestanding Tub & Floor Valve Setup',
      image: '/assets/images/bathroom_plumbing.jpg',
      location: 'Ville-Marie, QC',
      details: 'Rough-in and installation of a modern freestanding bathtub filler and drain trap.',
      beforeText: 'Outdated alcove tub setup.',
      afterText: 'Sleek freestanding tub with high-flow floor mounted tub filler.'
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <main>
      {/* Hero Header */}
      <section style={{ background: 'linear-gradient(135deg, var(--navy-950), var(--navy-900))', color: 'var(--white)', padding: '4.5rem 0' }}>
        <div className="container text-center" style={{ maxWidth: 720 }}>
          <span className="badge badge-primary" style={{ background: 'rgba(0,102,204,0.2)', color: 'var(--cyan-400)', borderColor: 'rgba(0,102,204,0.3)' }}>
            <Camera size={16} /> Work Portfolio
          </span>
          <h1 style={{ color: 'var(--white)', fontSize: '3rem', marginTop: '0.75rem', marginBottom: '1rem' }}>
            Recent Plumbing Projects
          </h1>
          <p style={{ color: 'var(--slate-200)', fontSize: '1.1rem' }}>
            Browse through our portfolio of clean, high-precision plumbing installations, water heater upgrades, 
            and emergency repair transformations across Greater Montreal.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container section-padding">
        {/* Filter Tabs */}
        <div className="gallery-filters">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Projects ({projects.length})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'water-heaters' ? 'active' : ''}`}
            onClick={() => setActiveFilter('water-heaters')}
          >
            Water Heaters
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'bathroom' ? 'active' : ''}`}
            onClick={() => setActiveFilter('bathroom')}
          >
            Bathroom Plumbing
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'emergency' ? 'active' : ''}`}
            onClick={() => setActiveFilter('emergency')}
          >
            Emergency Repairs
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'piping' ? 'active' : ''}`}
            onClick={() => setActiveFilter('piping')}
          >
            Piping & Repiping
          </button>
        </div>

        {/* Project Grid */}
        <div className="gallery-grid">
          {filteredProjects.map((p) => (
            <div key={p.id} className="gallery-card" onClick={() => setSelectedProject(p)} style={{ cursor: 'pointer' }}>
              <div className="gallery-img-wrap">
                <img src={p.image} alt={p.title} />
                <span className="gallery-tag">{p.categoryLabel}</span>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(11, 37, 69, 0.4)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white)' }} className="gallery-hover-overlay">
                  <div style={{ background: 'var(--blue-600)', padding: '0.625rem 1.25rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Eye size={18} /> Inspect Project
                  </div>
                </div>
              </div>
              <div className="gallery-info">
                <h3 className="gallery-title">{p.title}</h3>
                <p className="gallery-desc">{p.details}</p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                  <span>📍 {p.location}</span>
                  <span style={{ color: 'var(--blue-600)' }}>View Details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox / Detail Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-card animate-fade-in" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}>
              <X size={20} />
            </button>

            <img 
              src={selectedProject.image} 
              alt={selectedProject.title} 
              style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }} 
            />

            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              {selectedProject.categoryLabel} Project Showcase
            </span>
            <h2 style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>{selectedProject.title}</h2>
            <p style={{ color: 'var(--slate-600)', marginBottom: '1.5rem' }}>{selectedProject.details}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--slate-100)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--slate-200)' }}>
              <div>
                <h4 style={{ color: 'var(--amber-600)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Initial Problem</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{selectedProject.beforeText}</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--blue-600)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Master Plumber Solution</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{selectedProject.afterText}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setSelectedProject(null); openQuoteModal(); }}>
                Request Similar Work Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
