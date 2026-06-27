/**
 * Oportunidad de activación (FR-3) — entidad del plano ligero.
 *
 * Una Oportunidad es una acción de marketing basada en datos del hincha que
 * explota los derechos del patrocinio para generar valor de negocio. En el
 * plano ligero se deriva de señales públicas agregadas (sin PII); su precisión
 * se eleva luego con first-party del Clean Room (Épica 4), sin bloquear (AD-1).
 *
 * `core/opportunities` es el módulo dueño de esta entidad (AD-7).
 */

import type { PropiedadId } from '@/core/shared/tenant';
import type { CategoriaSenal } from '@/core/intelligence/senal';

/** Métrica de negocio que la Oportunidad busca mover (FR-3). */
export type MetricaNegocio =
  | 'conversion'
  | 'trafico'
  | 'consideracion'
  | 'awareness'
  | 'afinidad'
  | 'engagement';

/** Nivel de confianza del estimado de valor potencial. */
export type Confianza = 'alta' | 'media' | 'baja';

/**
 * Valor potencial estimado de una Oportunidad (FR-4). El método es transparente
 * y versionado (resuelve H-16): cada estimado expone qué métrica, qué supuesto y
 * qué confianza, y qué versión del método lo produjo.
 */
export interface ValorPotencial {
  /** Puntuación 0–100 comparable entre oportunidades. */
  estimado: number;
  /** Métrica de negocio sobre la que se estima. */
  metrica: MetricaNegocio;
  /** Supuesto explícito detrás del estimado. */
  supuesto: string;
  /** Confianza en el estimado. */
  confianza: Confianza;
  /** Versión del método de estimación (auditable). */
  metodoVersion: string;
}

export interface Oportunidad {
  id: string;
  propiedadId: PropiedadId;
  /** Título accionable de la oportunidad. */
  titulo: string;
  /** A quién se dirige (derivado de la sociodemografía agregada + la señal). */
  segmentoObjetivo: string;
  /** Señal pública que la origina (trazabilidad — AC de la Historia 1.3). */
  senalOrigenId: string;
  senalOrigenEtiqueta: string;
  categoriaSenal: CategoriaSenal;
  /** Hipótesis de valor de negocio (qué se espera lograr y por qué). */
  hipotesisValor: string;
  /** Métrica de negocio que se busca mover. */
  metricaNegocio: MetricaNegocio;
  /** Valor potencial estimado (lo asigna la priorización — Historia 1.4). */
  valorPotencial?: ValorPotencial;
}

/** Oportunidad ya priorizada: el valor potencial está garantizado. */
export interface OportunidadPriorizada extends Oportunidad {
  valorPotencial: ValorPotencial;
}
