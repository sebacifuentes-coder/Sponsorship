/**
 * Helper de borde: lee las señales públicas de una Propiedad para el plano ligero.
 *
 * - Con Supabase configurado: lee del Almacén de Inteligencia Pública persistido.
 * - Sin Supabase (local/demo): deriva las señales del adaptador semilla y las
 *   normaliza, para que el plano ligero funcione sin credenciales (AD-1).
 *
 * Compone proveedor + núcleo en el borde; el núcleo no conoce esta wiring.
 */

import { isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { SupabaseAlmacenInteligenciaPublica } from '@/lib/repositories/intelligence-repository';
import { SeedPublicDataAdapter } from '@/adapters/publicdata/seed-public-data-adapter';
import { normalizarSenal, type SenalPublica } from '@/core/intelligence/senal';
import type { PropiedadId } from '@/core/shared/tenant';

export async function leerSenalesPublicas(propiedadId: PropiedadId): Promise<SenalPublica[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    return new SupabaseAlmacenInteligenciaPublica(supabase).listarSenales(propiedadId);
  }

  // Demo local: deriva de la fuente semilla (mismo origen que la ingesta).
  const crudas = await new SeedPublicDataAdapter().obtenerSenales(propiedadId);
  const ahora = new Date().toISOString();
  return crudas.map((c) => normalizarSenal(c, propiedadId, ahora));
}

/** Propiedad de demostración para el modo local sin Supabase. */
export const DEMO_PROPIEDAD_ID = '00000000-0000-4000-8000-000000000001';
