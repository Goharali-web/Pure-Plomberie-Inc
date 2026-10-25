import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Mail, Key, LogOut, RefreshCw, 
  Phone, Calendar, AlertTriangle, CheckCircle, Clock, Trash2, Database, Copy, Check,
  UserCheck, ShieldAlert
} from 'lucide-react';
import { 
  supabase, 
  fetchBookings, 
  updateBookingStatus, 
  deleteBooking 
} from '../supabaseClient';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [dbError, setDbError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // SQL Hardening Schema for Copy/Paste in Supabase Dashboard
  const sqlSchemaCode = `-- =========================================================================
-- PURE PLOMBERIE INC - PRODUCTION SECURITY & RLS MIGRATION
-- Run this in your Supabase Dashboard -> SQL Editor
-- =========================================================================

-- 1. Create canonical bookings table with DB constraints
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL CHECK (length(trim(name)) >= 2),
  phone VARCHAR(25) NOT NULL CHECK (length(trim(phone)) >= 7),
  email VARCHAR(255) NOT NULL CHECK (length(trim(email)) >= 5 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
  service_needed VARCHAR(100) NOT NULL DEFAULT 'General Inquiry',
  urgency VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (urgency IN ('standard', 'urgent', 'emergency')),
  property_type VARCHAR(30) NOT NULL DEFAULT 'residential' CHECK (property_type IN ('residential', 'commercial', 'industrial')),
  address VARCHAR(300),
  message VARCHAR(2000),
  estimated_price VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);

-- 2. Create / align appointments table for backwards compatibility
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL CHECK (length(trim(name)) >= 2),
  phone VARCHAR(25) NOT NULL CHECK (length(trim(phone)) >= 7),
  email VARCHAR(255) NOT NULL CHECK (length(trim(email)) >= 5),
  service_needed VARCHAR(100) DEFAULT 'General Inquiry',
  urgency VARCHAR(20) DEFAULT 'standard',
  property_type VARCHAR(30) DEFAULT 'residential',
  address VARCHAR(300),
  message VARCHAR(2000),
  estimated_price VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS) on both tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 4. Clean up any existing loose/permissive policies
DROP POLICY IF EXISTS "Allow public inserts" ON public.appointments;
DROP POLICY IF EXISTS "Allow public read" ON public.appointments;
DROP POLICY IF EXISTS "Allow public update" ON public.appointments;
DROP POLICY IF EXISTS "Allow public delete" ON public.appointments;
DROP POLICY IF EXISTS "Allow public inserts" ON public.bookings;
DROP POLICY IF EXISTS "Allow public read" ON public.bookings;
DROP POLICY IF EXISTS "Allow public update" ON public.bookings;
DROP POLICY IF EXISTS "Allow public delete" ON public.bookings;
DROP POLICY IF EXISTS "anon_insert_booking" ON public.bookings;
DROP POLICY IF EXISTS "admin_select_bookings" ON public.bookings;
DROP POLICY IF EXISTS "admin_update_bookings" ON public.bookings;
DROP POLICY IF EXISTS "admin_delete_bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_insert_appointment" ON public.appointments;
DROP POLICY IF EXISTS "admin_select_appointments" ON public.appointments;
DROP POLICY IF EXISTS "admin_update_appointments" ON public.appointments;
DROP POLICY IF EXISTS "admin_delete_appointments" ON public.appointments;

-- 5. Server-enforced admin verification helper
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
    OR auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'ga480926@gmail.com'
    ),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 6. Strict RLS for bookings: Anonymous INSERT ONLY, Admin SELECT/UPDATE/DELETE
CREATE POLICY "anon_insert_booking" ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND length(trim(name)) >= 2
    AND length(trim(phone)) >= 7
    AND length(trim(email)) >= 5
  );

CREATE POLICY "admin_select_bookings" ON public.bookings
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "admin_update_bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admin_delete_bookings" ON public.bookings
  FOR DELETE TO authenticated USING (public.is_admin());

-- 7. Strict RLS for appointments
CREATE POLICY "anon_insert_appointment" ON public.appointments
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND length(trim(name)) >= 2
    AND length(trim(phone)) >= 7
    AND length(trim(email)) >= 5
  );

CREATE POLICY "admin_select_appointments" ON public.appointments
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "admin_update_appointments" ON public.appointments
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admin_delete_appointments" ON public.appointments
  FOR DELETE TO authenticated USING (public.is_admin());

-- 8. Assign admin role in app_metadata & confirm admin email
UPDATE auth.users
SET 
  raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb,
  email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email = 'ga480926@gmail.com';

-- 9. Protect auth.users from open public signups
CREATE OR REPLACE FUNCTION public.protect_auth_signups()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email NOT IN ('ga480926@gmail.com') THEN
    RAISE EXCEPTION 'Public registration is disabled for this organization.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_auth_signups ON auth.users;
CREATE TRIGGER tr_protect_auth_signups
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_auth_signups();
`;

  // Check Supabase Auth Session on mount
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setAuthChecking(false);
          if (session) {
            loadBookings();
          }
        }
      } catch (err) {
        if (mounted) {
          setAuthChecking(false);
        }
      }
    }

    initSession();

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (currentSession) {
        loadBookings();
      } else {
        setBookings([]);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setDbError(null);
    const result = await fetchBookings();

    if (result.error) {
      setDbError(result.error);
    } else {
      setBookings(result.data || []);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) {
        if (error.message?.includes('Email not confirmed')) {
          setLoginError('Your admin email is pending confirmation. Please run the SQL setup script in your Supabase SQL Editor to auto-confirm.');
        } else {
          setLoginError('Invalid login credentials. Please check your admin email and password.');
        }
        setLoading(false);
        return;
      }

      if (data?.session) {
        // Enforce admin identity check
        const userRole = data.session.user.app_metadata?.role;
        const userEmail = data.session.user.email?.toLowerCase();
        const isAuthorized = userRole === 'admin' || userEmail === 'ga480926@gmail.com';

        if (!isAuthorized) {
          await supabase.auth.signOut();
          setLoginError('Unauthorized: Your account does not have administrative privileges.');
          setLoading(false);
          return;
        }

        setSession(data.session);
        setPassword('');
        loadBookings();
      }
    } catch (err) {
      setLoginError('Authentication failed. Please verify Supabase connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setBookings([]);
  };

  const handleStatusChange = async (id, newStatus) => {
    const res = await updateBookingStatus(id, newStatus);
    if (res.success) {
      setBookings(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } else {
      alert(`Could not update status: ${res.error || 'Permission denied'}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking lead? This action is permanent.')) {
      const res = await deleteBooking(id);
      if (res.success) {
        setBookings(prev => prev.filter(item => item.id !== id));
      } else {
        alert(`Could not delete: ${res.error || 'Permission denied'}`);
      }
    }
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'emergency') return b.urgency === 'emergency';
    return (b.status || 'pending') === filterStatus;
  });

  const countPending = bookings.filter(a => (a.status || 'pending') === 'pending').length;
  const countEmergency = bookings.filter(a => a.urgency === 'emergency').length;
  const countCompleted = bookings.filter(a => a.status === 'completed').length;

  // Loading spinner during initial session check
  if (authChecking) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--slate-600)' }}>
          <RefreshCw size={24} className="animate-spin" />
          <span>Verifying security credentials...</span>
        </div>
      </main>
    );
  }

  // Login view if unauthenticated
  if (!session) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div style={{ background: 'var(--white)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-xl)', width: '100%', maxWidth: 460 }}>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <div className="logo-icon" style={{ margin: '0 auto 1rem auto', width: 48, height: 48 }}>
              <Lock size={24} />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Admin Portal Login</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)' }}>Authenticated Lead & Dispatch Management</p>
          </div>

          {loginError && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>{loginError}</div>
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
                placeholder="ga480926@gmail.com"
                autoComplete="email"
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
                placeholder="••••••••••••"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', minHeight: 48 }}>
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={16} className="animate-spin" /> Authenticating...
                </span>
              ) : (
                'Secure Log In to Admin Portal'
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-200)', fontSize: '0.75rem', color: 'var(--slate-500)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
              <ShieldCheck size={14} color="#16A34A" /> Protected by Supabase Auth & Row Level Security
            </div>
            Authorized Staff Only • Pure Plomberie Inc
          </div>
        </div>
      </main>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <main style={{ padding: '3rem 0', background: 'var(--slate-100)', minHeight: '85vh' }}>
      <div className="container">
        {/* Top Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-primary"><ShieldCheck size={14} /> Admin Portal</span>
              <span className="badge" style={{ background: '#DCFCE7', color: '#15803D', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <UserCheck size={14} /> {session.user.email}
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>Customer Bookings & Dispatch Leads</h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={() => setShowSqlGuide(!showSqlGuide)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: 40 }}>
              <Database size={16} /> {showSqlGuide ? 'Hide SQL Script' : 'Supabase Hardening SQL'}
            </button>
            <button className="btn btn-outline" onClick={loadBookings} disabled={loading} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: 40 }}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Leads
            </button>
            <button className="btn btn-primary" onClick={handleLogout} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: 40, background: 'var(--navy-900)' }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Database / RLS Setup Error Banner */}
        {dbError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <ShieldAlert size={24} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#991B1B', marginBottom: '0.35rem' }}>
                  Supabase Security Policy Setup Required
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#7F1D1D', marginBottom: '0.5rem' }}>
                  Supabase returned: <strong>{dbError}</strong>
                </p>
                <p style={{ fontSize: '0.85rem', color: '#991B1B' }}>
                  This means your <code>bookings</code> table or RLS policies have not been applied yet in your Supabase backend. Click <strong>"Supabase Hardening SQL"</strong> above, copy the SQL script, and run it in your <strong>Supabase Dashboard → SQL Editor</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SQL Setup Modal / Card */}
        {showSqlGuide && (
          <div style={{ background: 'var(--navy-950)', color: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={20} color="var(--cyan-400)" />
                <h3 style={{ color: 'var(--white)', fontSize: '1.2rem' }}>Production SQL Migration & RLS Script</h3>
              </div>
              <button className="btn btn-white" onClick={copySqlToClipboard} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', minHeight: 36 }}>
                {copiedSql ? <Check size={14} color="green" /> : <Copy size={14} />} {copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-300)', marginBottom: '1rem' }}>
              To enforce strict Row Level Security, prevent anonymous reads, and activate the admin role for <code>ga480926@gmail.com</code>:
              Paste this script into your <strong>Supabase Dashboard → SQL Editor</strong> and click <strong>Run</strong>.
            </p>
            <pre style={{ background: 'rgba(0,0,0,0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: '#A5F3FC', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
              {sqlSchemaCode}
            </pre>
          </div>
        )}

        {/* KPI Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>Total Bookings</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-900)' }}>{bookings.length}</div>
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
            { id: 'all', label: `All (${bookings.length})` },
            { id: 'pending', label: `Pending (${countPending})` },
            { id: 'contacted', label: 'Contacted' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: `Completed (${countCompleted})` },
            { id: 'emergency', label: `🚨 Emergency (${countEmergency})` },
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

        {/* Bookings Leads Cards */}
        {filteredBookings.length === 0 ? (
          <div style={{ background: 'var(--white)', padding: '3rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--slate-200)' }}>
            <Clock size={40} color="var(--slate-400)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-700)' }}>No booking leads in this filter view</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
              When customers submit quotes or booking requests, they will appear here in real time.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredBookings.map((app) => {
              // Sanitize phone & email URLs to prevent javascript: or protocol smuggling
              const safePhone = (app.phone || '').replace(/[^0-9+()-\s]/g, '');
              const safeEmail = (app.email || '').trim();

              return (
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
                        <span className="badge" style={{ background: '#F1F5F9', color: '#475569' }}>
                          ID: {app.id?.slice(0, 8)}
                        </span>
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
                        <a href={`tel:${safePhone}`} style={{ color: 'var(--blue-600)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Phone size={14} /> {app.phone}
                        </a>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.15rem' }}>
                        <a href={`mailto:${safeEmail}`} style={{ color: 'inherit' }}>{app.email}</a>
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
                        {app.estimated_price || 'Quote Pending'}
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

                  {app.message && (
                    <div style={{ fontSize: '0.9rem', color: 'var(--slate-700)', background: '#FEF3C7', padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FCD34D' }}>
                      <strong>Customer Problem Notes:</strong> {app.message}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
