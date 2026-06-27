/**
 * Objetivos de comunicación de la campaña (FR-17, Historia 2.3) — contexto.
 *
 * Tercer bloque del "Contexto de marca y patrocinio" (PRD §4.9). Los objetivos
 * vigentes orientan la PRIORIZACIÓN de oportunidades (Historia 1.4): las
 * oportunidades cuya métrica de negocio alinea con un objetivo activo suben.
 *
 * Para no acoplar `core/opportunities` a `core/context` (evita un ciclo: context
 * ya depende de opportunities), aquí se traduce objetivo → métricas favorecidas
 * y la priorización recibe solo ese conjunto de métricas. Mapeo DETERMINISTA y
 * versionado, como el resto del plano ligero (H-16).
 *
 * Dominio puro: sin framework ni proveedores (AD-2).
 */

import type { MetricaNegocio } from '@/core/opportunities/oportunidad';

/** Catálogo canónico de objetivos de comunicación (PRD §Glosario, "etc."). */
export const OBJETIVOS_COMUNICACION = [
  'awareness',
  'consideracion',
  'conversion',
  'lanzamiento',
  'fidelizacion',
] as const;

export type ObjetivoComunicacion = (typeof OBJETIVOS_COMUNICACION)[number];

/** Etiqueta legible de cada objetivo (para la UI). */
export const ETIQUETA_OBJETIVO: Record<ObjetivoComunicacion, string> = {
  awareness: 'Awareness (notoriedad)',
  consideracion: 'Consideración',
  conversion: 'Conversión',
  lanzamiento: 'Lanzamiento',
  fidelizacion: 'Fidelización',
};

export function esObjetivoComunicacion(valor: unknown): valor is ObjetivoComunicacion {
  return (
    typeof valor === 'string' &&
    (OBJETIVOS_COMUNICACION as readonly string[]).includes(valor)
  );
}

/** Versión del mapa objetivo↔métrica que afina la priorización. */
export const AJUSTE_OBJETIVO_VERSION = 'objetivos-v1';

/** Qué métricas de negocio favorece cada objetivo de comunicación. */
const METRICAS_POR_OBJETIVO: Record<ObjetivoComunicacion, readonly MetricaNegocio[]> = {
  awareness: ['awareness', 'afinidad'],
  consideracion: ['consideracion', 'trafico', 'engagement'],
  conversion: ['conversion', 'trafico'],
  lanzamiento: ['awareness', 'consideracion'],
  fidelizacion: ['afinidad', 'engagement'],
};

/**
 * Conjunto de métricas favorecidas por los objetivos vigentes. Vacío si no hay
 * objetivos (la priorización queda neutral — preserva la Historia 1.4).
 */
export function metricasFavorecidas(
  objetivos: readonly ObjetivoComunicacion[],
): Set<MetricaNegocio> {
  const set = new Set<MetricaNegocio>();
  for (const o of objetivos) {
    for (const m of METRICAS_POR_OBJETIVO[o]) set.add(m);
  }
  return set;
}
