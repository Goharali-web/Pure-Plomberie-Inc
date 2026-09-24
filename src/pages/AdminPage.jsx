import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Mail, Key, LogOut, RefreshCw, 
  Phone, Calendar, AlertTriangle, CheckCircle, Clock, Trash2, Database, Copy, Check 
} from 'lucide-react';
import { supabase, fetchAppointments, updateAppointmentStatus, deleteAppointment } from '../supabaseClient';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('pure_plomberie_admin_auth') === 'true';
  });
  const [email, setEmail] = useState('ga480926@gmail.com');
  const [password, setPassword] = useState('K9$mPq2#vL7n');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated]);

  const loadAppointments = async () => {
    setLoading(true);
    const data = await fetchAppointments();
    setAppointments(data);
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    // Check against provided credentials
    if (email.trim().toLowerCase() === 'ga480926@gmail.com' && password === 'K9$mPq2#vL7n') {
      setIsAuthenticated(true);
      localStorage.setItem('pure_plomberie_admin_auth', 'true');
      return;
    }

    // Try Supabase Auth as secondary check
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (data?.session) {
        setIsAuthenticated(true);
        localStorage.setItem('pure_plomberie_admin_auth', 'true');
      } else {
        setLoginError(error?.message || 'Invalid email or password credentials.');
      }
    } catch (err) {
      setLoginError('Authentication failed. Please check credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pure_plomberie_admin_auth');
  };

  const handleStatusChange = async (id, newStatus) => {
    const res = await updateAppointmentStatus(id, newStatus);
    if (res.success) {
      setAppointments(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment lead?')) {
      const res = await deleteAppointment(id);
      if (res.success) {
        setAppointments(prev => prev.filter(item => item.id !== id));
      }
    }
  };

  const sqlSchemaCode = `-- Run this inside your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service_needed TEXT,
  urgency TEXT DEFAULT 'standard',
  property_type TEXT DEFAULT 'residential',
  address TEXT,
  message TEXT,
  estimated_price TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) & Public Insert Policy
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON public.appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON public.appointments
  FOR SELECT USING (true);

CREATE POLICY "Allow public update" ON public.appointments
  FOR UPDATE USING (true);
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const filteredAppointments = appointments.filter(app => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'emergency') return app.urgency === 'emergency';
    return (app.status || 'pending') === filterStatus;
  });

  const countPending = appointments.filter(a => (a.status || 'pending') === 'pending').length;
  const countEmergency = appointments.filter(a => a.urgency === 'emergency').length;
  const countCompleted = appointments.filter(a => a.status === 'completed').length;

  if (!isAuthenticated) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div style={{ background: 'var(--white)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-xl)', width: '100%', maxWidth: 440 }}>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <div className="logo-icon" style={{ margin: '0 auto 1rem auto', width: 48, height: 48 }}>
              <Lock size={24} />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Admin Dashboard Login</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)' }}>Supabase Backend Lead Management</p>
          </div>

          {loginError && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Mail size={16} /> Admin Email
              </label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Key size={16} /> Password
              </label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', minHeight: 48 }}>
              Log In to Admin Portal
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-200)', fontSize: '0.75rem', color: 'var(--slate-500)', textAlign: 'center' }}>
            Authorized Staff Only • Pure Plomberie Inc & Supabase DB
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '3rem 0', background: 'var(--slate-100)', minHeight: '85vh' }}>
      <div className="container">
        {/* Top Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-primary"><ShieldCheck size={14} /> Admin Portal</span>
              <span className="badge" style={{ background: '#E0F2FE', color: '#0369A1' }}>Supabase Connected</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>Appointment & Quote Submissions</h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={() => setShowSqlGuide(!showSqlGuide)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: 40 }}>
              <Database size={16} /> {showSqlGuide ? 'Hide SQL Setup' : 'Supabase SQL Setup'}
            </button>
            <button className="btn btn-outline" onClick={loadAppointments} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: 40 }}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Leads
            </button>
            <button className="btn btn-primary" onClick={handleLogout} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: 40, background: 'var(--navy-900)' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* SQL Setup Modal / Card */}
        {showSqlGuide && (
          <div style={{ background: 'var(--navy-950)', color: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={20} color="var(--cyan-400)" />
                <h3 style={{ color: 'var(--white)', fontSize: '1.2rem' }}>Supabase SQL Schema & Table Creation Code</h3>
              </div>
              <button className="btn btn-white" onClick={copySqlToClipboard} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', minHeight: 36 }}>
                {copiedSql ? <Check size={14} color="green" /> : <Copy size={14} />} {copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-300)', marginBottom: '1rem' }}>
              If you haven't created the `appointments` table in your Supabase project dashboard yet, go to your 
              <strong> Supabase Dashboard → SQL Editor</strong> and paste the following script:
            </p>
            <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: '#A5F3FC', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
              {sqlSchemaCode}
            </pre>
          </div>
        )}

        {/* KPI Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>Total Submissions</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)' }}>{appointments.length}</div>
          </div>
          <div style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>Pending Follow-up</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--blue-600)' }}>{countPending}</div>
          </div>
          <div style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>Emergency Requests</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--amber-600)' }}>{countEmergency}</div>
          </div>
          <div style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>Completed</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#16A34A' }}>{countCompleted}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {[
            { id: 'all', label: `All (${appointments.length})` },
            { id: 'pending', label: `Pending (${countPending})` },
            { id: 'contacted', label: 'Contacted' },
            { id: 'completed', label: `Completed (${countCompleted})` },
            { id: 'emergency', label: `🚨 Emergency Only (${countEmergency})` },
          ].map(t => (
            <button
              key={t.id}
              className={`filter-btn ${filterStatus === t.id ? 'active' : ''}`}
              onClick={() => setFilterStatus(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Leads Cards List */}
        {filteredAppointments.length === 0 ? (
          <div style={{ background: 'var(--white)', padding: '3rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--slate-200)' }}>
            <Clock size={40} color="var(--slate-400)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-700)' }}>No appointment leads found in this filter category</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>When someone fills out a contact or quote request form, it will appear here in real-time.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredAppointments.map((app) => (
              <div 
                key={app.id} 
                style={{ 
                  background: 'var(--white)', 
                  borderRadius: 'var(--radius-xl)', 
                  padding: '1.75rem', 
                  border: app.urgency === 'emergency' ? '2px solid var(--amber-500)' : '1px solid var(--slate-200)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.3rem' }}>{app.name || 'Anonymous Client'}</h3>
                      {app.urgency === 'emergency' && (
                        <span className="badge badge-emergency">
                          <AlertTriangle size={14} /> IMMEDIATE EMERGENCY
                        </span>
                      )}
                      {app.isLocalFallback && (
                        <span className="badge" style={{ background: '#FEF3C7', color: '#92400E' }}>
                          Local Record
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                      Submitted {new Date(app.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-600)' }}>Status:</label>
                    <select 
                      value={app.status || 'pending'} 
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="form-select"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.875rem', minHeight: 38, width: 'auto' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button onClick={() => handleDelete(app.id)} style={{ color: '#EF4444', padding: '0.5rem' }} title="Delete Lead">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', background: 'var(--slate-100)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Contact Info</strong>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem' }}>
                      <a href={`tel:${app.phone}`} style={{ color: 'var(--blue-600)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={14} /> {app.phone}
                      </a>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.15rem' }}>
                      <a href={`mailto:${app.email}`} style={{ color: 'inherit' }}>{app.email}</a>
                    </div>
                  </div>

                  <div>
                    <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Service Requested</strong>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-900)', marginTop: '0.25rem' }}>
                      {app.service_needed}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                      Property: {app.property_type || 'Residential'}
                    </div>
                  </div>

                  <div>
                    <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Estimated Upfront Quote</strong>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--blue-600)', marginTop: '0.25rem' }}>
                      {app.estimated_price || app.estimatedPriceRange || 'Quote Pending'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                      Urgency: {app.urgency}
                    </div>
                  </div>
                </div>

                {app.address && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--slate-700)', marginBottom: '0.75rem' }}>
                    <strong>Address:</strong> {app.address}
                  </div>
                )}

                {(app.message || app.details) && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--slate-700)', background: '#FEF3C7', padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FCD34D' }}>
                    <strong>Issue Notes:</strong> {app.message || app.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
