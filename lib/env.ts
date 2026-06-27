/**
 * Acceso tipado a variables de entorno (AD-6 — secretos fuera del repo).
 *
 * Ningún secreto vive en el repositorio: todo se lee de variables de entorno.
 * El acceso es perezoso y tolerante: si Supabase aún no está configurado, la
 * app sigue corriendo en local (el primer valor del plano ligero no debe
 * bloquearse por falta de integración — AD-1). Ver `.env.example`.
 */

function leer(nombre: string): string | undefined {
  const valor = process.env[nombre];
  return valor && valor.length > 0 ? valor : undefined;
}

export const env = {
  get supabaseUrl(): string {
    return leer('NEXT_PUBLIC_SUPABASE_URL') ?? '';
  },
  get supabaseAnonKey(): string {
    return leer('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? '';
  },
  /** Solo servidor — nunca expuesto al cliente. */
  get supabaseServiceRoleKey(): string {
    return leer('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  },
};

/** ¿Hay credenciales mínimas de Supabase para activar auth/RLS? */
export function isSupabaseConfigured(): boolean {
  return Boolean(leer('NEXT_PUBLIC_SUPABASE_URL') && leer('NEXT_PUBLIC_SUPABASE_ANON_KEY'));
}
