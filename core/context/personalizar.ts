/**
 * Personalización de oportunidades con el contexto de marca (Historia 2.5).
 *
 * Consolida en un solo lugar cómo el contexto de marca moldea el mapa de
 * oportunidades del plano ligero:
 *   - los OBJETIVOS vigentes (FR-17) afinan la priorización (boost por métrica);
 *   - los DERECHOS contratados (FR-15) limitan la propuesta a lo activable.
 *
 * Sin contexto, equivale a la priorización base (Historia 1.4): el primer valor
 * nunca se bloquea (AD-1). El ADN y el contexto adicional personalizan la
 * GENERACIÓN del concepto (ver `concebirConcepto` + el borde), no el orden.
 */

import type { SenalPublica } from '@/core/intelligence/senal';
import {
  priorizarOportunidades,
  type Oportunidad,
  type OportunidadPriorizada,
} from '@/core/opportunities';
import { limitarADerechosContratados } from '@/core/context/derecho';
import { metricasFavorecidas } from '@/core/context/objetivos';
import type { ContextoMarca } from '@/core/context/contexto-marca';

export function personalizarOportunidades(
  generadas: Oportunidad[],
  senales: SenalPublica[],
  ctx: ContextoMarca,
): OportunidadPriorizada[] {
  const priorizadas = priorizarOportunidades(
    generadas,
    senales,
    metricasFavorecidas(ctx.objetivos),
  );
  return limitarADerechosContratados(priorizadas, ctx.derechos);
}
