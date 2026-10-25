import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, Phone, Mail, Clock, Send, ShieldCheck, 
  AlertTriangle, CheckCircle2, Navigation, MessageSquare 
} from 'lucide-react';
import { saveBooking } from '../supabaseClient';

export default function ContactPage({ showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceNeeded: 'leak-repair',
    urgency: 'standard',
    message: ''
  });

  // Anti-spam honeypot state (must remain empty for human users)
  const [honeypot, setHoneypot] = useState('');
  const [formRenderTime, setFormRenderTime] = useState(0);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setFormRenderTime(Date.now());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const validateInput = () => {
    const name = formData.name.trim();
    if (name.length < 2 || name.length > 100) {
      return 'Please enter a valid full name (2 to 100 characters).';
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      return 'Please enter a valid telephone number (at least 7 to 15 digits).';
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address (e.g. name@example.com).';
    }

    const message = formData.message.trim();
    if (message.length < 5 || message.length > 2000) {
      return 'Please describe your request (between 5 and 2000 characters).';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // 1. Anti-Spam: Honeypot trap check
    if (honeypot && honeypot.trim().length > 0) {
      // Bot filled the hidden honeypot field -> simulate success and drop
      setSubmitted(true);
      return;
    }

    // 2. Anti-Spam: Form completion timing check (bots submit instantaneously)
    const timeToFill = Date.now() - formRenderTime;
    if (timeToFill < 1500) {
      setFormError('Please take a moment to review your details before submitting.');
      return;
    }

    // 3. Rate limiting: restrict submissions to 1 per 30 seconds
    const lastSubmitTime = localStorage.getItem('last_booking_submit');
    const now = Date.now();
    if (lastSubmitTime && now - parseInt(lastSubmitTime, 10) < 30000) {
      setFormError('Please wait 30 seconds before submitting another request.');
      return;
    }

    // 4. Input validation
    const validationErr = validateInput();
    if (validationErr) {
      setFormError(validationErr);
      return;
    }

    setSubmitting(true);
    localStorage.setItem('last_booking_submit', now.toString());
    
    const submissionData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim().toLowerCase(),
      serviceNeeded: formData.serviceNeeded,
      urgency: formData.urgency,
      message: formData.message.trim()
    };

    // Save to Supabase backend
    const result = await saveBooking(submissionData);

    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      showToast('Booking Request Saved! A dispatch coordinator will contact you within 15 mins.');
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
        setFormRenderTime(Date.now());
      }, 5000);
    } else {
      setFormError(result.error || 'Unable to submit request. Please call our 24/7 dispatch phone directly.');
    }
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
            Have a question, need an upfront estimate, or facing a plumbing emergency? Our master plumbers are available 24/7.
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

            {formError && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>{formError}</span>
              </div>
            )}

            {submitted ? (
              <div style={{ background: 'var(--cyan-100)', border: '1px solid var(--cyan-400)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="var(--blue-600)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>Thank You!</h3>
                <p style={{ color: 'var(--slate-700)' }}>Your message has been logged securely and assigned to a dispatch coordinator.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot field for bot trapping - invisible to real humans */}
                <div style={{ display: 'none', opacity: 0, position: 'absolute', left: '-9999px', pointerEvents: 'none' }} aria-hidden="true">
                  <label htmlFor="website_hp">Leave this field blank</label>
                  <input 
                    type="text" 
                    id="website_hp" 
                    name="website_hp" 
                    value={honeypot} 
                    onChange={(e) => setHoneypot(e.target.value)} 
                    tabIndex={-1} 
                    autoComplete="off" 
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      maxLength={100}
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
                      maxLength={25}
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
                      maxLength={255}
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
                      maxLength={2000}
                      placeholder="Tell us about your plumbing project, leak symptoms, or requested service time..." 
                      value={formData.message} 
                      onChange={handleChange} 
                      className="form-input" 
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '1rem', minHeight: 48 }}
                >
                  <Send size={18} /> {submitting ? 'Submitting Request...' : 'Send Message to Dispatch'}
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
