/**
 * Concepto de activación del plano ligero (Historia 1.5, FR-14).
 *
 * Precursor ligero de una Activación: un concepto accionable derivado de forma
 * DETERMINISTA de la oportunidad de mayor valor y del brief mínimo (marca +
 * objetivo). NO es la generación creativa con IA — esa es la Épica 3 (FR-5),
 * sobre la entidad `Activacion` con su ciclo borrador→aprobada→publicada (AD-7).
 * Aquí solo se entrega el primer valor sin esperar a nada externo (AD-1).
 */

import type { CategoriaSenal } from '@/core/intelligence/senal';
import type { MetricaNegocio, OportunidadPriorizada } from '@/core/opportunities/oportunidad';

export interface BriefMinimo {
  marca: string;
  /** Objetivo de comunicación: awareness · consideracion · conversion · lanzamiento. */
  objetivo: string;
}

export interface ConceptoActivacion {
  oportunidadId: string;
  titulo: string;
  anguloMensaje: string;
  canalSugerido: string;
  segmento: string;
  llamadaAccion: string;
  /** Aviso honesto: concepto base determinista; la creatividad con IA es la Épica 3. */
  nota: string;
}

const CANAL_POR_CATEGORIA: Record<CategoriaSenal, string> = {
  busqueda_intencion: 'Search / performance (capturar el momento de intención)',
  consumo_canal: 'El canal de mayor consumo del hincha (móvil / streaming)',
  opinion_sentimiento: 'Social orgánico + contenido de marca',
  narrativa_social: 'Social e influencers alineados a la narrativa',
  sociodemografia: 'Mix de medios afín al segmento',
};

const LLAMADA_POR_METRICA: Record<MetricaNegocio, string> = {
  conversion: 'Compra ahora con un código de seguimiento dedicado',
  trafico: 'Descúbrelo en una landing con seguimiento',
  consideracion: 'Compara y considéralo',
  awareness: 'Conócelo',
  afinidad: 'Vive la historia con el club',
  engagement: 'Participa y comparte',
};

/**
 * Concibe un concepto de activación sobre la oportunidad de mayor valor.
 * Determinista y explicable; pensado para el primer valor en minutos.
 */
export function concebirConcepto(
  oportunidad: OportunidadPriorizada,
  brief: BriefMinimo,
): ConceptoActivacion {
  const canal = CANAL_POR_CATEGORIA[oportunidad.categoriaSenal];
  const llamada = LLAMADA_POR_METRICA[oportunidad.metricaNegocio];

  const anguloMensaje =
    `Para ${brief.marca}, con objetivo de ${brief.objetivo}: conectar con ${oportunidad.segmentoObjetivo.toLowerCase()} ` +
    `a partir de "${oportunidad.senalOrigenEtiqueta}", apalancando el patrocinio del club.`;

  return {
    oportunidadId: oportunidad.id,
    titulo: `Concepto: ${oportunidad.titulo}`,
    anguloMensaje,
    canalSugerido: canal,
    segmento: oportunidad.segmentoObjetivo,
    llamadaAccion: llamada,
    nota: 'Concepto base determinista del plano ligero. La generación creativa con IA y el ciclo de aprobación llegan en la Épica 3 (FR-5/FR-6).',
  };
}
