import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bzwvjaoxmbjxowntrttq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_wvNZZEzL7IOcQibOiymnvg_JsgxWVSy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Save an appointment/quote submission to Supabase `appointments` table
 */
export async function saveAppointment(data) {
  try {
    const payload = {
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      service_needed: data.serviceNeeded || data.service || 'General Inquiry',
      urgency: data.urgency || 'standard',
      property_type: data.propertyType || 'residential',
      address: data.address || '',
      message: data.message || data.details || '',
      estimated_price: data.estimatedPriceRange || data.estimatedPrice || null,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data: insertedData, error } = await supabase
      .from('appointments')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase DB Insert Warning/Error:', error.message);
      // Store in localStorage as fallback so no lead is lost if table permissions/creation is pending
      const existing = JSON.parse(localStorage.getItem('pure_plomberie_appointments') || '[]');
      existing.unshift({ ...payload, id: 'local_' + Date.now(), isLocal: true });
      localStorage.setItem('pure_plomberie_appointments', JSON.stringify(existing));
      return { success: true, isLocalFallback: true, error: error.message };
    }

    return { success: true, data: insertedData };
  } catch (err) {
    console.error('Unexpected error in saveAppointment:', err);
    // Fallback to localStorage
    const existing = JSON.parse(localStorage.getItem('pure_plomberie_appointments') || '[]');
    existing.unshift({ ...data, id: 'local_' + Date.now(), isLocal: true, status: 'pending', created_at: new Date().toISOString() });
    localStorage.setItem('pure_plomberie_appointments', JSON.stringify(existing));
    return { success: true, isLocalFallback: true, error: err.message };
  }
}

/**
 * Fetch all appointments from Supabase (plus any local fallbacks)
 */
export async function fetchAppointments() {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    const localData = JSON.parse(localStorage.getItem('pure_plomberie_appointments') || '[]');

    if (error) {
      console.warn('Could not fetch from Supabase appointments table:', error.message);
      return localData;
    }

    // Merge Supabase + Local records
    const combined = [...(data || []), ...localData];
    return combined;
  } catch (err) {
    console.error('Error fetching appointments:', err);
    return JSON.parse(localStorage.getItem('pure_plomberie_appointments') || '[]');
  }
}

/**
 * Update appointment status in Supabase
 */
export async function updateAppointmentStatus(id, newStatus) {
  try {
    if (typeof id === 'string' && id.startsWith('local_')) {
      const localData = JSON.parse(localStorage.getItem('pure_plomberie_appointments') || '[]');
      const updated = localData.map(item => item.id === id ? { ...item, status: newStatus } : item);
      localStorage.setItem('pure_plomberie_appointments', JSON.stringify(updated));
      return { success: true };
    }

    const { data, error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating status:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error updating status:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete an appointment record
 */
export async function deleteAppointment(id) {
  try {
    if (typeof id === 'string' && id.startsWith('local_')) {
      const localData = JSON.parse(localStorage.getItem('pure_plomberie_appointments') || '[]');
      const filtered = localData.filter(item => item.id !== id);
      localStorage.setItem('pure_plomberie_appointments', JSON.stringify(filtered));
      return { success: true };
    }

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
