import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Clock, Send, ShieldCheck, 
  AlertTriangle, CheckCircle2, Navigation, MessageSquare 
} from 'lucide-react';
import { saveAppointment } from '../supabaseClient';

export default function ContactPage({ showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceNeeded: 'leak-repair',
    urgency: 'standard',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side rate limiting: restrict submissions to 1 per 30 seconds
    const lastSubmitTime = localStorage.getItem('last_appointment_submit');
    const now = Date.now();
    if (lastSubmitTime && now - parseInt(lastSubmitTime, 10) < 30000) {
      showToast('Please wait 30 seconds before submitting another request.');
      return;
    }

    setSubmitting(true);
    localStorage.setItem('last_appointment_submit', now.toString());
    
    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      source: 'Contact Page Web Form'
    };

    // Save to Supabase backend
    await saveAppointment(submissionData);

    setSubmitting(false);
    setSubmitted(true);
    showToast('Appointment Request Saved to Supabase! We will contact you within 15 mins.');

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        serviceNeeded: 'leak-repair',
        urgency: 'standard',
        message: ''
      });
    }, 4000);
  };

  return (
    <main>
      {/* Contact Header */}
      <section style={{ background: 'linear-gradient(135deg, var(--navy-950), var(--navy-900))', color: 'var(--white)', padding: '4.5rem 0' }}>
        <div className="container text-center" style={{ maxWidth: 720 }}>
          <span className="badge badge-primary" style={{ background: 'rgba(0,102,204,0.2)', color: 'var(--cyan-400)', borderColor: 'rgba(0,102,204,0.3)' }}>
            Get In Touch
          </span>
          <h1 style={{ color: 'var(--white)', fontSize: '3rem', marginTop: '0.75rem', marginBottom: '1rem' }}>
            Contact Pure Plomberie Inc
          </h1>
          <p style={{ color: 'var(--slate-200)', fontSize: '1.1rem' }}>
            Have a question, need an upfront estimate, or facing a plumbing emergency? Our team is available 24/7.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="container section-padding">
        <div className="contact-grid">
          {/* Contact Form Card */}
          <div className="contact-form-card">
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Send Us a Message</h2>
              <p style={{ color: 'var(--slate-600)' }}>Fill out the form below for fast response & upfront pricing.</p>
            </div>

            {submitted ? (
              <div style={{ background: 'var(--cyan-100)', border: '1px solid var(--cyan-400)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="var(--blue-600)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>Thank You, {formData.name}!</h3>
                <p style={{ color: 'var(--slate-700)' }}>Your message has been logged and assigned to a dispatch coordinator.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      placeholder="e.g. Jean Dupont" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      required 
                      placeholder="(514) 555-7873" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group form-grid-full">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      placeholder="jean.dupont@example.ca" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="form-input" 
                    />
                  </div>

                  <div className="form-group">
                    <label>Service Needed *</label>
                    <select 
                      name="serviceNeeded" 
                      value={formData.serviceNeeded} 
                      onChange={handleChange} 
                      className="form-select"
                    >
                      <option value="leak-repair">Leak Detection & Repair</option>
                      <option value="drain-cleaning">Hydro-Jet Drain Cleaning</option>
                      <option value="water-heater">Water Heater Installation</option>
                      <option value="emergency">24/7 Emergency Plumbing</option>
                      <option value="pipe-replacement">Pipe Replacement / Repiping</option>
                      <option value="bathroom-kitchen">Bathroom / Kitchen Plumbing</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Urgency Level</label>
                    <select 
                      name="urgency" 
                      value={formData.urgency} 
                      onChange={handleChange} 
                      className="form-select"
                    >
                      <option value="standard">Standard (Next 24-48 Hours)</option>
                      <option value="urgent">Urgent (Today / Within 4 Hours)</option>
                      <option value="emergency">EMERGENCY (Immediate 30-min dispatch)</option>
                    </select>
                  </div>

                  <div className="form-group form-grid-full">
                    <label>Message / Issue Description *</label>
                    <textarea 
                      name="message" 
                      rows="4" 
                      required 
                      placeholder="Tell us about your plumbing project, leak symptoms, or requested service time..." 
                      value={formData.message} 
                      onChange={handleChange} 
                      className="form-input"
                    ></textarea>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                  <Send size={18} /> Submit Message (Console Log)
                </button>
              </form>
            )}
          </div>

          {/* Contact Info Side Panel */}
          <div className="contact-info-panel">
            <div className="info-card" style={{ background: 'linear-gradient(135deg, var(--navy-900), var(--navy-800))' }}>
              <div className="info-icon">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="info-title">24/7 Dispatch Phone</h3>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--amber-500)', margin: '0.25rem 0' }}>
                  (514) 555-PURE (7873)
                </div>
                <div className="info-text">Toll-Free Dispatch: 1 (800) 555-PLUMB</div>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="info-title">Headquarters Address</h3>
                <div className="info-text" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--white)', marginBottom: '0.25rem' }}>
                  Pure Plomberie Inc.
                </div>
                <div className="info-text">
                  1450 Rue Peel, Suite 400<br />
                  Montréal, QC H3A 1T1, Canada
                </div>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="info-title">Business & Dispatch Hours</h3>
                <div className="info-text">
                  <strong style={{ color: 'var(--amber-500)' }}>Emergency Dispatch:</strong> 24 Hours / 7 Days<br />
                  <strong>Office Hours:</strong> Mon - Fri: 7:00 AM - 7:00 PM<br />
                  <strong>Sat - Sun:</strong> 8:00 AM - 5:00 PM
                </div>
              </div>
            </div>

            {/* Embedded Map Visual Container */}
            <div className="map-placeholder">
              <div className="map-pin-badge">
                <MapPin size={18} color="var(--amber-500)" /> Greater Montreal Service Region
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '0.75rem' }}>
                Serving Montreal, West Island, Laval, Longueuil & South Shore
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
