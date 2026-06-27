/**
 * Instrumentación del Tiempo al Primer Valor (TTFV) — invariante de producto.
 *
 * El TTFV es la restricción de diseño de mayor impacto (NFR-1, SM-5): primer
 * valor en < 10 min y ≤ 3 pasos. Se mide en cada primer uso y se registra como
 * log estructurado; si Supabase está configurado, también se persiste para
 * calcular la mediana (data/migrations/0003_ttfv.sql). Spine §Observabilidad.
 */

import { z } from 'zod';
import { isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';

export const eventoTtfvSchema = z.object({
  propiedadId: z.string().min(1),
  marca: z.string().min(1),
  objetivo: z.string().min(1),
  /** Número de pasos del onboarding (invariante: ≤ 3). */
  pasos: z.number().int().min(1).max(3),
  /** Duración desde el paso 1 hasta el primer valor, en milisegundos. */
  duracionMs: z.number().int().nonnegative(),
});

export type EventoTtfv = z.infer<typeof eventoTtfvSchema>;

/** Umbral de éxito del TTFV: 10 minutos. */
export const TTFV_OBJETIVO_MS = 10 * 60 * 1000;

export interface ResultadoTtfv extends EventoTtfv {
  dentroDelObjetivo: boolean;
  persistido: boolean;
}

export async function registrarTtfv(evento: EventoTtfv): Promise<ResultadoTtfv> {
  const dentroDelObjetivo = evento.duracionMs <= TTFV_OBJETIVO_MS;

  // Log estructurado (siempre).
  console.info(
    JSON.stringify({
      metrica: 'ttfv',
      ...evento,
      dentroDelObjetivo,
      ts: new Date().toISOString(),
    }),
  );

  let persistido = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('ttfv_eventos').insert({
        propiedad_id: evento.propiedadId,
        marca: evento.marca,
        objetivo: evento.objetivo,
        pasos: evento.pasos,
        duracion_ms: evento.duracionMs,
        dentro_del_objetivo: dentroDelObjetivo,
      });
      persistido = !error;
    } catch {
      // La métrica no debe romper el primer valor (AD-1): si falla, solo log.
      persistido = false;
    }
  }

  return { ...evento, dentroDelObjetivo, persistido };
}
