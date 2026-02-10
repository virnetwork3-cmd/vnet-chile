import { createClient } from '@supabase/supabase-js';

/**
 * Obtiene una variable de entorno de forma segura.
 * Vite inyecta variables en import.meta.env.
 */
const getEnvVar = (key: string): string | undefined => {
  try {
    // Usamos encadenamiento opcional para evitar errores si 'env' no existe
    return (import.meta as any).env?.[key];
  } catch (e) {
    return undefined;
  }
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 'https://hswudumfmuzlgjbdwlaa.supabase.co'; 
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_aFMNBoEuGV-bNzqX-N4Xig_-sctpbfF';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
