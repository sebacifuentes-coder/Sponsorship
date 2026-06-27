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
}
