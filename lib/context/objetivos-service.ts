/**
 * Helper de borde de los objetivos de comunicación (Historia 2.3).
 *
 * - Con Supabase configurado: persistencia real con RLS (AD-9).
 * - Sin Supabase (local/demo): store en memoria singleton (AD-1).
 *
 * Compone proveedor + núcleo en el borde; el núcleo no conoce esta wiring.
 */

import { isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { SupabaseRepositorioObjetivos } from '@/lib/repositories/context-repository';
import { repositorioObjetivosDemo } from '@/lib/context/store-demo';
import type { RepositorioObjetivos } from '@/core/context';
import type { MarcaId } from '@/core/shared/tenant';
import type { ObjetivoComunicacion } from '@/core/context';

export async function repositorioObjetivos(): Promise<RepositorioObjetivos> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    return new SupabaseRepositorioObjetivos(supabase);
  }
  return repositorioObjetivosDemo();
}

/** Atajo de lectura: objetivos vigentes de una Marca (lista, posiblemente vacía). */
export async function leerObjetivos(marcaId: MarcaId): Promise<ObjetivoComunicacion[]> {
  const repo = await repositorioObjetivos();
  const registro = await repo.obtenerObjetivos(marcaId);
  return registro?.objetivos ?? [];
}
