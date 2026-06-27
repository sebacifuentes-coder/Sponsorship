/**
 * Helper de borde: resuelve el repositorio de derechos según el entorno.
 *
 * - Con Supabase configurado: persistencia real con RLS (multi-tenant — AD-9).
 * - Sin Supabase (local/demo): store en memoria sembrado (AD-1: corre sin
 *   credenciales).
 *
 * Compone proveedor + núcleo en el borde; el núcleo no conoce esta wiring.
 */

import { isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { SupabaseRepositorioDerechos } from '@/lib/repositories/context-repository';
import { repositorioDerechosDemo } from '@/lib/context/store-demo';
import type { RepositorioDerechos } from '@/core/context';
import type { MarcaId } from '@/core/shared/tenant';
import type { DerechoContratado } from '@/core/context';

export async function repositorioDerechos(): Promise<RepositorioDerechos> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    return new SupabaseRepositorioDerechos(supabase);
  }
  return repositorioDerechosDemo();
}

/** Atajo de lectura usado por las páginas del plano ligero. */
export async function leerDerechos(marcaId: MarcaId): Promise<DerechoContratado[]> {
  const repo = await repositorioDerechos();
  return repo.listarDerechos(marcaId);
}
