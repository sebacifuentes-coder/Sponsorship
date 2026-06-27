import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { env, isSupabaseConfigured } from '@/lib/env';

/**
 * Refresca la sesión de Supabase en cada petición (patrón @supabase/ssr).
 * Si Supabase aún no está configurado, no-opera: la app corre en local sin
 * secretos (AD-6) y el plano ligero no se bloquea por falta de integración (AD-1).
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANTE: refresca el token. No insertar lógica entre createServerClient
  // y getUser() (recomendación de Supabase para evitar cierres de sesión).
  await supabase.auth.getUser();

  return response;
}
