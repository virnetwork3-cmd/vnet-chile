
import { createClient } from '@supabase/supabase-js';

/**
 * CONFIGURACIÓN DE NÚCLEO VNET:
 * Estas variables se obtienen de las capturas de pantalla del usuario.
 * Vercel las sobreescribirá si se configuran en su panel (recomendado para producción).
 */

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://hswudumfmuzlgjbdwlaa.supabase.co'; 
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_aFMNBoEuGV-bNzqX-N4Xig_-sctpbfF';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERROR DE VÍNCULO: Faltan credenciales de Supabase. Verifique el panel de control.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
