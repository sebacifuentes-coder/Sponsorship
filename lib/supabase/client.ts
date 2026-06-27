import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';

/**
 * Cliente Supabase para componentes de cliente (browser).
 * Auth vía Supabase (AD-9). Se instancia bajo demanda, no en el módulo, para
 * no exigir credenciales en build (AD-6).
 */
export function createClient() {
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
