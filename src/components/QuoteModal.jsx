import React, { useState } from 'react';
import { X, CheckCircle, Calculator, Phone, AlertCircle, Wrench } from 'lucide-react';
import { saveAppointment } from '../supabaseClient';

export default function QuoteModal({ isOpen, onClose, showToast }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: 'leak-repair',
    propertyType: 'residential',
    urgency: 'standard',
    name: '',
    phone: '',
    email: '',
    address: '',
    details: ''
  });

  if (!isOpen) return null;

  const getEstimatedPrice = () => {
    let base = 150;
    if (formData.service === 'drain-cleaning') base = 180;
    if (formData.service === 'water-heater') base = 450;
    if (formData.service === 'emergency') base = 250;
    if (formData.service === 'pipe-replacement') base = 600;
    if (formData.service === 'bathroom') base = 350;

    if (formData.propertyType === 'commercial') base *= 1.4;
    if (formData.urgency === 'emergency') base += 120;

    return {
      min: Math.round(base),
      max: Math.round(base * 1.35)
    };
  };

  const estimated = getEstimatedPrice();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionPayload = {
      ...formData,
      estimatedPriceRange: `$${estimated.min} - $${estimated.max}`,
      submittedAt: new Date().toISOString()
    };
    
    // Console log submission
    console.log('=== PURE PLOMBERIE INC - FREE QUOTE SUBMISSION ===');
    console.log(submissionPayload);
    console.log('==================================================');

    // Save to Supabase
    await saveAppointment(submissionPayload);

    showToast('Quote Saved to Supabase! A dispatch coordinator will call you within 15 minutes.');
    onClose();
    setStep(1);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div className="logo-icon" style={{ width: 36, height: 36 }}>
            <Wrench size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem' }}>Instant Free Quote Request</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)' }}>Get a transparent upfront estimate in 60 seconds</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', margin: '1.25rem 0' }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: step >= 1 ? 'var(--blue-600)' : 'var(--slate-200)' }}></div>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: step >= 2 ? 'var(--blue-600)' : 'var(--slate-200)' }}></div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label>Service Needed *</label>
                  <select name="service" value={formData.service} onChange={handleChange} className="form-select">
                    <option value="leak-repair">Leak Detection & Repair ($150 - $250 est.)</option>
                    <option value="drain-cleaning">Hydro-Jet Drain Cleaning ($180 - $320 est.)</option>
                    <option value="water-heater">Water Heater Installation / Repair ($450 - $950 est.)</option>
                    <option value="emergency">24/7 Emergency Plumbing ($250+ est.)</option>
                    <option value="pipe-replacement">Pipe Replacement & Re-piping ($600+ est.)</option>
                    <option value="bathroom">Bathroom & Kitchen Plumbing ($350+ est.)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Property Type</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="form-select">
                    <option value="residential">Single Family Home / Condo</option>
                    <option value="commercial">Commercial Building / Office</option>
                    <option value="industrial">Industrial / Multi-unit</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Timeline / Urgency</label>
                  <select name="urgency" value={formData.urgency} onChange={handleChange} className="form-select">
                    <option value="standard">Standard (Next 24-48 hours)</option>
                    <option value="urgent">Urgent (Today / Within 4 hours)</option>
                    <option value="emergency">IMMEDIATE EMERGENCY (30-min dispatch)</option>
                  </select>
                </div>

                {/* Estimate Preview */}
                <div className="estimator-result" style={{ margin: '0.5rem 0' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Estimated Upfront Range
                  </div>
                  <div className="result-price">${estimated.min} - ${estimated.max}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    Includes travel & initial master plumber diagnostic inspection
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  onClick={() => setStep(2)}
                >
                  Continue to Contact Info →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                <div className="form-grid-2col">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      required 
                      placeholder="(514) 000-0000" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      placeholder="jean@example.ca" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="form-input" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Service Address / Neighborhood</label>
                  <input 
                    type="text" 
                    name="address" 
                    placeholder="e.g. 1450 Peel St, Montreal, QC" 
                    value={formData.address} 
                    onChange={handleChange} 
                    className="form-input" 
                  />
                </div>

                <div className="form-group">
                  <label>Additional Issue Notes (Optional)</label>
                  <textarea 
                    name="details" 
                    rows="3" 
                    placeholder="Describe the issue (e.g. water leak under sink, clogged drain...)" 
                    value={formData.details} 
                    onChange={handleChange} 
                    className="form-input"
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setStep(1)}
                    style={{ flex: 1 }}
                  >
                    ← Back
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ flex: 2 }}
                  >
                    Submit Quote Request
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
