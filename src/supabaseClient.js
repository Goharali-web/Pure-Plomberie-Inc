import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bzwvjaoxmbjxowntrttq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_wvNZZEzL7IOcQibOiymnvg_JsgxWVSy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Sanitizes text input to prevent abuse and normalize values
 */
function sanitizeText(value, maxLength = 255) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

/**
 * Save a customer booking request to Supabase.
 * Checks `bookings` table first, falls back to `appointments` if schema migration is pending.
 *
 * NOTE ON RLS SECURITY:
 * Under strict production RLS, anonymous users have INSERT permission ONLY.
 * We must NEVER call `.select()` on this query; calling `.select()` triggers a
 * SELECT operation which anonymous clients are forbidden from executing.
 */
export async function saveBooking(data) {
  try {
    const payload = {
      name: sanitizeText(data.name, 100),
      phone: sanitizeText(data.phone, 25),
      email: sanitizeText(data.email, 255).toLowerCase(),
      service_needed: sanitizeText(data.serviceNeeded || data.service || 'General Inquiry', 100),
      urgency: ['standard', 'urgent', 'emergency'].includes(data.urgency) ? data.urgency : 'standard',
      property_type: ['residential', 'commercial', 'industrial'].includes(data.propertyType) ? data.propertyType : 'residential',
      address: sanitizeText(data.address, 300),
      message: sanitizeText(data.message || data.details, 2000),
      estimated_price: sanitizeText(data.estimatedPriceRange || data.estimatedPrice, 100),
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Attempt insert into canonical `bookings` table
    let { error } = await supabase.from('bookings').insert([payload]);

    // If bookings table not found (PGRST205), try fallback `appointments` table
    if (error && (error.code === 'PGRST205' || error.message?.includes('schema cache'))) {
      const fallbackResult = await supabase.from('appointments').insert([payload]);
      error = fallbackResult.error;
    }

    if (error) {
      // Log sanitized error code without customer PII
      console.warn('Booking submission error (code):', error.code || 'UNKNOWN_ERROR');
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error processing booking submission');
    return { success: false, error: 'Network error submitting request. Please call dispatch directly.' };
  }
}

// Backwards-compatible alias
export const saveAppointment = saveBooking;

/**
 * Fetch all customer bookings from Supabase.
 * Enforced by PostgreSQL RLS: Only authenticated admin sessions can read rows.
 */
export async function fetchBookings() {
  try {
    // Attempt fetch from `bookings` table
    let { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    // Fallback to `appointments` if `bookings` table is not yet created
    if (error && (error.code === 'PGRST205' || error.message?.includes('schema cache'))) {
      const fallback = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      return { data: [], error: error.message, code: error.code };
    }

    return { data: data || [], error: null };
  } catch (err) {
    console.error('Error fetching bookings from Supabase');
    return { data: [], error: err.message };
  }
}

// Backwards-compatible alias
export const fetchAppointments = fetchBookings;

/**
 * Update booking status (Admin only - RLS enforced)
 */
export async function updateBookingStatus(id, newStatus) {
  const allowed = ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'];
  if (!allowed.includes(newStatus)) {
    return { success: false, error: 'Invalid status' };
  }

  try {
    let { data, error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);

    if (error && (error.code === 'PGRST205' || error.message?.includes('schema cache'))) {
      const fallback = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Backwards-compatible alias
export const updateAppointmentStatus = updateBookingStatus;

/**
 * Delete a booking record (Admin only - RLS enforced)
 */
export async function deleteBooking(id) {
  try {
    let { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error && (error.code === 'PGRST205' || error.message?.includes('schema cache'))) {
      const fallback = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      error = fallback.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Backwards-compatible alias
export const deleteAppointment = deleteBooking;
