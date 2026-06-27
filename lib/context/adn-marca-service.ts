/**
 * Helpers de borde del ADN de marca: resuelven repositorio y puerto de sugerencia.
 *
 * - Repositorio: Supabase con RLS si está configurado; en memoria (singleton)
 *   en modo demo (AD-1: corre sin credenciales).
 * - Puerto de sugerencia: hoy el adaptador semilla determinista; en la Épica 3
 *   se sustituye por el adaptador de LLM sin tocar el núcleo (AD-5).
 *
 * Compone proveedor + núcleo en el borde; el núcleo no conoce esta wiring.
 */

import { isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { SupabaseRepositorioAdnMarca } from '@/lib/repositories/context-repository';
import { repositorioAdnDemo } from '@/lib/context/store-demo';
import { SeedBrandDnaAdapter } from '@/adapters/branddna/seed-brand-dna-adapter';
import type { RepositorioAdnMarca } from '@/core/context';
import type { BrandDnaPort } from '@/ports/brand-dna-port';
import type { MarcaId } from '@/core/shared/tenant';
import type { AdnMarca } from '@/core/context';

export async function repositorioAdn(): Promise<RepositorioAdnMarca> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    return new SupabaseRepositorioAdnMarca(supabase);
  }
  return repositorioAdnDemo();
}

/** Puerto de sugerencia de ADN vigente (adaptador semilla hasta la Épica 3). */
export function brandDnaPort(): BrandDnaPort {
  return new SeedBrandDnaAdapter();
}

/** Atajo de lectura usado por las páginas. */
export async function leerAdn(marcaId: MarcaId): Promise<AdnMarca | null> {
  const repo = await repositorioAdn();
  return repo.obtenerAdn(marcaId);
}
