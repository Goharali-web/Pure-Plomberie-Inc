import React from 'react';
import { ShieldCheck, Award, Users, CheckCircle2, Clock, ThumbsUp, Sparkles, Building, Phone } from 'lucide-react';

export default function AboutPage({ openQuoteModal }) {
  const stats = [
    { label: 'Years of Excellence', value: '15+' },
    { label: 'Completed Projects', value: '8,500+' },
    { label: 'Certified Plumbers', value: '18' },
    { label: 'On-Time Response', value: '99.4%' },
  ];

  const teamMembers = [
    {
      name: 'Jean-Philippe Roy',
      role: 'Founder & Master Plumber',
      experience: '20+ Yrs Exp | CMMTQ Certified',
      desc: 'Founded Pure Plomberie Inc in 2009 with a mission to bring true transparency and clean workmanship to Quebec homes.'
    },
    {
      name: 'Benoit Gagnon',
      role: 'Head of Commercial Dispatch',
      experience: '14+ Yrs Exp | Backflow Specialist',
      desc: 'Expert in high-pressure hydro-jetting, backflow testing, and heavy commercial plumbing infrastructure.'
    },
    {
      name: 'Marc-Antoine Côté',
      role: 'Senior Residential Specialist',
      experience: '10+ Yrs Exp | Tankless Water Heaters',
      desc: 'Specializes in high-efficiency continuous water heater installs and custom luxury bathroom repiping.'
    }
  ];

  const certifications = [
    { title: 'RBQ Master Plumbing Licence', sub: 'Régie du bâtiment du Québec #5689-1234-01' },
    { title: 'CMMTQ Member in Good Standing', sub: 'Corporation des maîtres mécaniciens en tuyauterie du Québec' },
    { title: 'Interprovincial Red Seal Certification', sub: 'Nationally recognized master journeyman standard' },
    { title: '$5M Liability Insurance Coverage', sub: 'Complete peace of mind protection for your property' }
  ];

  return (
    <main>
      {/* About Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--navy-950), var(--navy-900))', color: 'var(--white)', padding: '4.5rem 0' }}>
        <div className="container text-center" style={{ maxWidth: 740 }}>
          <span className="badge badge-primary" style={{ background: 'rgba(0,102,204,0.2)', color: 'var(--cyan-400)', borderColor: 'rgba(0,102,204,0.3)' }}>
            Our Heritage & Story
          </span>
          <h1 style={{ color: 'var(--white)', fontSize: '3rem', marginTop: '0.75rem', marginBottom: '1rem' }}>
            Built on Integrity, Precision & Clean Craftsmanship
          </h1>
          <p style={{ color: 'var(--slate-200)', fontSize: '1.1rem' }}>
            Since 2009, Pure Plomberie Inc has served Greater Montreal with certified master plumbing services, 
            upfront flat pricing, and an unyielding commitment to customer trust.
          </p>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section style={{ background: 'var(--white)', padding: '3rem 0', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {stats.map((st, i) => (
              <div key={i}>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--blue-600)', lineHeight: 1 }}>{st.value}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--slate-600)', fontWeight: 600, marginTop: '0.5rem' }}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="container section-padding">
        <div className="about-story-grid">
          <div>
            <span className="badge badge-primary">Our Company Story</span>
            <h2 style={{ fontSize: '2.4rem', marginTop: '0.75rem', marginBottom: '1.25rem' }}>
              Redefining Plumbing Standards in Greater Montreal
            </h2>
            <p style={{ color: 'var(--slate-600)', marginBottom: '1rem', fontSize: '1.05rem' }}>
              Pure Plomberie Inc was established with a clear goal: to eliminate the anxiety and price guesswork 
              homeowners traditionally experienced during plumbing emergencies.
            </p>
            <p style={{ color: 'var(--slate-600)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
              Our team of certified master plumbers treats every home with the utmost respect. We don't just fix pipes; 
              we educate our clients on maintenance, provide fixed flat-rate quotes upfront, and guarantee spotless cleanup.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <CheckCircle2 size={20} color="var(--blue-600)" />
                <span style={{ fontWeight: 600, color: 'var(--navy-900)' }}>100% Upfront Guaranteed Flat Rates</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <CheckCircle2 size={20} color="var(--blue-600)" />
                <span style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Fully Stocked Mobile Dispatch Units</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <CheckCircle2 size={20} color="var(--blue-600)" />
                <span style={{ fontWeight: 600, color: 'var(--navy-900)' }}>1-Year Parts & Workmanship Warranty</span>
              </div>
            </div>
          </div>

          <div className="about-mission-card">
            <div className="logo-icon" style={{ width: 52, height: 52, marginBottom: '1.5rem', background: 'var(--blue-600)' }}>
              <Sparkles size={28} />
            </div>
            <h3 style={{ color: 'var(--white)', fontSize: '1.8rem', marginBottom: '1rem' }}>Our Core Mission</h3>
            <p style={{ color: 'var(--slate-200)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              "To deliver immediate, high-precision plumbing solutions with uncompromised safety, environmental care, 
              and complete price transparency for every residence and business we serve."
            </p>
            <button className="btn btn-emergency" onClick={openQuoteModal} style={{ width: '100%' }}>
              Schedule Service With Our Team
            </button>
          </div>
        </div>
      </section>

      {/* Team Showcase */}
      <section style={{ background: 'var(--white)', padding: '5rem 0', borderTop: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: 640, margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-primary"><Users size={16} /> Expert Team</span>
            <h2 style={{ fontSize: '2.4rem', marginTop: '0.75rem' }}>Meet Our Master Plumbers</h2>
            <p style={{ color: 'var(--slate-600)' }}>Licensed, background-checked, and dedicated to your peace of mind.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {teamMembers.map((member, idx) => (
              <div key={idx} style={{ background: 'var(--slate-100)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--navy-900)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  {member.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{member.name}</h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--blue-600)', fontWeight: 700, marginBottom: '0.5rem' }}>{member.role}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem' }}>{member.experience}</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Badges Section */}
      <section className="container section-padding">
        <div className="text-center" style={{ maxWidth: 640, margin: '0 auto 3rem auto' }}>
          <span className="badge badge-primary"><ShieldCheck size={16} /> Verified Credentials</span>
          <h2 style={{ fontSize: '2.4rem', marginTop: '0.75rem' }}>Licenses & Industry Badges</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {certifications.map((cert, index) => (
            <div key={index} style={{ background: 'var(--white)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <Award size={32} style={{ color: 'var(--blue-600)', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>{cert.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>{cert.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
