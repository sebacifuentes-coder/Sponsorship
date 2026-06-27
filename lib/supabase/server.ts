import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

/**
 * Cliente Supabase para Server Components, Route Handlers y Server Actions.
 * Usa las cookies de la petición para mantener la sesión (auth — AD-9).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Invocado desde un Server Component: el refresh de sesión lo hace
          // el middleware. Se puede ignorar con seguridad.
        }
      },
    },
  });
}
