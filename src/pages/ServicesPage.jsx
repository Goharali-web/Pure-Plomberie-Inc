import React, { useState } from 'react';
import { 
  Droplets, Waves, Flame, Clock, Wrench, Bath, 
  CheckCircle2, ArrowRight, ShieldCheck, ChevronDown, ChevronUp, HelpCircle
} from 'lucide-react';

export default function ServicesPage({ openQuoteModal }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const services = [
    {
      id: 'leak-repair',
      icon: <Droplets size={32} />,
      title: 'Leak Detection & Repair',
      subtitle: 'Non-destructive acoustic pinpointing & copper leak fixes',
      description: 'Undetected leaks under flooring or inside walls can cause thousands of dollars in structural mold and water damage. We utilize advanced electronic acoustic sensors and thermal imaging to locate leaks with zero unnecessary wall damage.',
      features: ['Acoustic sound testing', 'Thermal camera diagnostics', 'PEX & Copper pipe repairs', 'Slab leak isolation']
    },
    {
      id: 'drain-cleaning',
      icon: <Waves size={32} />,
      title: 'Hydro-Jet Drain Cleaning',
      iconColor: 'var(--cyan-400)',
      subtitle: 'High-pressure 4000 PSI cleaning & HD sewer camera inspection',
      description: 'Standard snakes only punch a hole through grease or tree roots. Our commercial-grade hydro-jetting cleans the entire inner circumference of pipes, flushing away decades of sludge and scale build-up.',
      features: ['HD color sewer camera video inspection', '4000 PSI hydro-jetting', 'Tree root cutting & removal', 'Grease trap line maintenance']
    },
    {
      id: 'water-heater',
      icon: <Flame size={32} />,
      title: 'Water Heater Installation & Repair',
      subtitle: 'Tankless & standard electrical/gas water heater systems',
      description: 'Never run out of hot water again. We install, repair, and maintain tankless continuous hot water heaters and energy-efficient traditional storage tank units with full warranty coverage.',
      features: ['Continuous tankless upgrades', 'Heating element replacement', 'Anode rod & tank flushing', 'Expansion tank installation']
    },
    {
      id: 'emergency-plumbing',
      icon: <Clock size={32} />,
      title: '24/7 Emergency Plumbing Dispatch',
      subtitle: 'Guaranteed 30-minute rapid response across Greater Montreal',
      description: 'Plumbing disasters do not adhere to business hours. Our emergency response team is dispatched 24 hours a day, 7 days a week, 365 days a year with fully stocked trucks.',
      features: ['Burst pipe emergency shut-off', 'Sewage backup extraction', 'Frozen pipe thaw service', 'Gas leak safety shut-off']
    },
    {
      id: 'pipe-replacement',
      icon: <Wrench size={32} />,
      title: 'Pipe Replacement & Re-piping',
      subtitle: 'Full building repiping, galvanized steel replacement & main line repairs',
      description: 'Replace aging galvanized iron or polybutylene pipes with modern, durable PEX or L-grade copper lines. Boost water pressure, improve drinking water clarity, and prevent future plumbing leaks.',
      features: ['Galvanized to PEX conversions', 'Main water service line replacement', 'Trenchless pipe repair', 'Backflow preventer valve testing']
    },
    {
      id: 'bathroom-kitchen',
      icon: <Bath size={32} />,
      title: 'Bathroom & Kitchen Plumbing',
      subtitle: 'Fixture installation, luxury shower valves & garbage disposals',
      description: 'Transform your bathroom or kitchen with master plumbing installation. We connect luxury rainfall shower systems, free-standing bathtubs, dishwashers, ice-maker lines, and garbage disposals.',
      features: ['Custom shower valve rough-in', 'Freestanding tub drain installation', 'Kitchen sink & faucet replacement', 'Garbage disposal setup']
    }
  ];

  const faqs = [
    {
      q: 'How fast can a plumber arrive during an emergency?',
      a: 'We maintain mobile service units dispatched across Montreal, Laval, and the South Shore. Our average arrival time for 24/7 emergency dispatch calls is under 30 minutes.'
    },
    {
      q: 'Do you charge by the hour or provide upfront flat rates?',
      a: 'We provide 100% transparent flat-rate quotes before starting any work. You will know the exact total upfront, so there are no surprise hourly charges on your final invoice.'
    },
    {
      q: 'Are your plumbers licensed and insured in Quebec?',
      a: 'Yes! Pure Plomberie Inc holds a valid RBQ master plumbing licence (RBQ: 5689-1234-01) and is an active member of the CMMTQ. All our plumbers are fully certified and carry $5,000,000 in liability insurance.'
    },
    {
      q: 'What should I do if a pipe bursts in my house right now?',
      a: 'First, immediately turn off your main water shut-off valve (usually located near the water meter or main entrance). Next, call our 24/7 emergency hotline at (514) 555-PURE for instant dispatch instructions.'
    }
  ];

  return (
    <main>
      {/* Page Header */}
      <section style={{ background: 'linear-gradient(135deg, var(--navy-950), var(--navy-900))', color: 'var(--white)', padding: '4.5rem 0' }}>
        <div className="container text-center" style={{ maxWidth: 720 }}>
          <span className="badge badge-primary" style={{ background: 'rgba(0,102,204,0.2)', color: 'var(--cyan-400)', borderColor: 'rgba(0,102,204,0.3)' }}>
            Expert Plumbing Catalog
          </span>
          <h1 style={{ color: 'var(--white)', fontSize: '3rem', marginTop: '0.75rem', marginBottom: '1rem' }}>
            Our Plumbing Services
          </h1>
          <p style={{ color: 'var(--slate-200)', fontSize: '1.1rem' }}>
            From precision leak detection to complete water heater replacements, our certified master plumbers deliver 
            unmatched quality and upfront flat-rate pricing.
          </p>
        </div>
      </section>

      {/* Services List Grid */}
      <section className="container section-padding">
        <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
          {services.map((s) => (
            <div key={s.id} className="service-card" style={{ padding: '2.5rem' }}>
              <div className="service-icon-wrap" style={{ background: 'rgba(0,102,204,0.1)', color: 'var(--blue-600)' }}>
                {s.icon}
              </div>
              <h2 style={{ fontSize: '1.45rem', marginBottom: '0.35rem' }}>{s.title}</h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--blue-600)', fontWeight: 600, marginBottom: '1rem' }}>
                {s.subtitle}
              </div>
              <p className="service-desc">{s.description}</p>
              
              <ul style={{ listStyle: 'none', margin: '1rem 0 1.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {s.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--navy-900)', fontWeight: 500 }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--blue-600)', flexShrink: 0 }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button className="btn btn-primary" onClick={openQuoteModal} style={{ width: '100%', marginTop: 'auto' }}>
                Request {s.title} Quote
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Service Process Timeline */}
      <section style={{ background: 'var(--white)', padding: '5rem 0', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: 600, margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-primary">Simple & Transparent</span>
            <h2 style={{ fontSize: '2.4rem', marginTop: '0.75rem' }}>How We Work With You</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              { num: '01', title: 'Schedule / Call', desc: 'Call our 24/7 line or request a free estimate online.' },
              { num: '02', title: 'On-Site Diagnostic', desc: 'Our master plumber inspects the issue thoroughly.' },
              { num: '03', title: 'Upfront Flat Rate', desc: 'We present a fixed price quote before work begins.' },
              { num: '04', title: 'Flawless Execution', desc: 'Clean, professional repair with 100% guarantee.' }
            ].map((step, idx) => (
              <div key={idx} style={{ background: 'var(--slate-100)', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--slate-200)' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--blue-600)', marginBottom: '0.5rem' }}>{step.num}</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="container section-padding">
        <div className="text-center" style={{ maxWidth: 640, margin: '0 auto 3rem auto' }}>
          <span className="badge badge-primary"><HelpCircle size={16} /> FAQ</span>
          <h2 style={{ fontSize: '2.4rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--slate-600)' }}>Have questions about plumbing repairs, costs, or warranties?</p>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              style={{ 
                background: 'var(--white)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--slate-200)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: 'var(--navy-900)',
                  textAlign: 'left'
                }}
              >
                <span>{faq.q}</span>
                {activeFaq === index ? <ChevronUp size={20} color="var(--blue-600)" /> : <ChevronDown size={20} color="var(--slate-400)" />}
              </button>

              {activeFaq === index && (
                <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: 'var(--slate-600)', fontSize: '0.95rem', borderTop: '1px solid var(--slate-100)', paddingTop: '1rem' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
