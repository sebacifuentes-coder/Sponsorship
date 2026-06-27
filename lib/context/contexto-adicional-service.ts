/**
 * Helper de borde del contexto adicional (Historia 2.4).
 *
 * - Con Supabase configurado: persistencia real con RLS (AD-9).
 * - Sin Supabase (local/demo): store en memoria singleton (AD-1).
 */

import { isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { SupabaseRepositorioContextoAdicional } from '@/lib/repositories/context-repository';
import { repositorioContextoAdicionalDemo } from '@/lib/context/store-demo';
import type { RepositorioContextoAdicional } from '@/core/context';
import type { MarcaId } from '@/core/shared/tenant';
import type { ContextoAdicional } from '@/core/context';

export async function repositorioContextoAdicional(): Promise<RepositorioContextoAdicional> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    return new SupabaseRepositorioContextoAdicional(supabase);
  }
  return repositorioContextoAdicionalDemo();
}

/** Atajo de lectura: contexto adicional de una Marca (o null). */
export async function leerContextoAdicional(
  marcaId: MarcaId,
): Promise<ContextoAdicional | null> {
  const repo = await repositorioContextoAdicional();
  return repo.obtenerContexto(marcaId);
}
