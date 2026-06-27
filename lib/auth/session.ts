import { createClient } from '@/lib/supabase/server';
import { esRolValido, type Rol } from '@/core/shared/roles';
import type { MarcaId, PropiedadId } from '@/core/shared/tenant';

/**
 * Sesión resuelta del usuario: identidad + rol + tenant (AD-9).
 * `lib/auth` traduce la autenticación de Supabase al modelo de dominio
 * (`core/shared`). Depende de `core/`, nunca al revés.
 */
export interface SesionUsuario {
  userId: string;
  email: string | null;
  rol: Rol | null;
  propiedadId: PropiedadId | null;
  marcaId: MarcaId | null;
}

/**
 * Devuelve la sesión del usuario autenticado o `null` si no hay sesión.
 * Lee el perfil (rol + tenant) de la tabla `perfiles` (ver data/migrations).
 */
export async function obtenerSesion(): Promise<SesionUsuario | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, propiedad_id, marca_id')
    .eq('id', user.id)
    .single();

  return {
    userId: user.id,
    email: user.email ?? null,
    rol: esRolValido(perfil?.rol) ? perfil.rol : null,
    propiedadId: perfil?.propiedad_id ?? null,
    marcaId: perfil?.marca_id ?? null,
  };
}
