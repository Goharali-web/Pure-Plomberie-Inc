-- =========================================================================
-- PURE PLOMBERIE INC - PRODUCTION SECURITY & RLS MIGRATION
-- Database: Supabase PostgreSQL (Project: bzwvjaoxmbjxowntrttq)
-- Purpose:
--   1. Create `bookings` table with strict DB column & length constraints.
--   2. Maintain backwards-compatible `appointments` table.
--   3. Enable strict Row Level Security (RLS) on both tables.
--   4. Anonymous users: INSERT ONLY (no SELECT, UPDATE, or DELETE).
--   5. Authenticated Admins: Full SELECT, UPDATE, DELETE permissions.
--   6. Server-enforced admin identity via app_metadata role and verified user ID.
--   7. Confirm admin email and assign role: 'admin'.
--   8. Block unauthorized public signups in auth.users.
-- =========================================================================

-- 1. Create the canonical `bookings` table with strict constraints
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL CHECK (length(trim(name)) >= 2),
  phone VARCHAR(25) NOT NULL CHECK (length(trim(phone)) >= 7),
  email VARCHAR(255) NOT NULL CHECK (length(trim(email)) >= 5 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  service_needed VARCHAR(100) NOT NULL DEFAULT 'General Inquiry',
  urgency VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (urgency IN ('standard', 'urgent', 'emergency')),
  property_type VARCHAR(30) NOT NULL DEFAULT 'residential' CHECK (property_type IN ('residential', 'commercial', 'industrial')),
  address VARCHAR(300),
  message VARCHAR(2000),
  estimated_price VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for admin dashboard querying and sorting
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);

-- 2. Create / align `appointments` table for backwards compatibility
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

-- Copy existing records from appointments to bookings if any exist
INSERT INTO public.bookings (name, phone, email, service_needed, urgency, property_type, address, message, estimated_price, status, created_at)
SELECT name, phone, email, service_needed, urgency, property_type, address, message, estimated_price, status, created_at
FROM public.appointments
ON CONFLICT DO NOTHING;

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 4. DROP INSECURE / PERMISSIVE POLICIES
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

-- 5. SERVER-ENFORCED ADMIN HELPER FUNCTION
-- Checks real authenticated identity via app_metadata.role or admin email
-- Does NOT trust user_metadata (which client users can freely edit)
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

-- 6. STRICT RLS POLICIES FOR `bookings`
-- Policy 1: Anonymous users may INSERT ONLY
-- Restricts status to 'pending' on insert so public users cannot tamper with status
CREATE POLICY "anon_insert_booking" ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND length(trim(name)) >= 2
    AND length(trim(phone)) >= 7
    AND length(trim(email)) >= 5
  );

-- Policy 2: Admin SELECT only
CREATE POLICY "admin_select_bookings" ON public.bookings
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Policy 3: Admin UPDATE only
CREATE POLICY "admin_update_bookings" ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy 4: Admin DELETE only
CREATE POLICY "admin_delete_bookings" ON public.bookings
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 7. STRICT RLS POLICIES FOR `appointments` (backwards compatibility)
CREATE POLICY "anon_insert_appointment" ON public.appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND length(trim(name)) >= 2
    AND length(trim(phone)) >= 7
    AND length(trim(email)) >= 5
  );

CREATE POLICY "admin_select_appointments" ON public.appointments
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "admin_update_appointments" ON public.appointments
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_delete_appointments" ON public.appointments
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 8. CONFIGURE ADMIN USER ACCOUNT & EMAIL CONFIRMATION
-- Sets role='admin' in protected app_metadata and confirms email
UPDATE auth.users
SET 
  raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb,
  email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email = 'ga480926@gmail.com';

-- 9. PREVENT PUBLIC SIGNUPS VIA DATABASE TRIGGER
-- Locks down self-registration so unauthorized strangers cannot create accounts
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
