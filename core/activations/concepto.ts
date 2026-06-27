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

/** Nivel de personalización del concepto (espejo de core/context, sin acoplar). */
export type NivelConcepto = 'basica' | 'personalizada';

/**
 * Contexto de marca para personalizar el concepto (Historia 2.5). Campos
 * primitivos para no acoplar `core/activations` a `core/context`: el borde los
 * extrae del ADN y del contexto adicional. Sin contexto → concepto básico.
 */
export interface ContextoConcepto {
  tonoVoz?: string;
  valores?: string[];
  audienciaObjetivo?: string;
  restriccionesMarca?: string;
}

export interface ConceptoActivacion {
  oportunidadId: string;
  titulo: string;
  anguloMensaje: string;
  canalSugerido: string;
  segmento: string;
  llamadaAccion: string;
  /** Nivel de personalización: básica (datos públicos) vs personalizada (contexto). */
  personalizacion: NivelConcepto;
  /** Bloques de contexto efectivamente referenciados (vacío si básica). */
  referencias: string[];
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
 *
 * Si se pasa `contexto` con ADN/audiencia (Historia 2.5), el concepto lo
 * REFERENCIA (tono de voz, valores, audiencia, restricciones) y se marca como
 * "personalizada". Sin contexto útil, usa el ángulo público por defecto y marca
 * la personalización como "básica".
 */
export function concebirConcepto(
  oportunidad: OportunidadPriorizada,
  brief: BriefMinimo,
  contexto?: ContextoConcepto,
): ConceptoActivacion {
  const canal = CANAL_POR_CATEGORIA[oportunidad.categoriaSenal];
  const llamada = LLAMADA_POR_METRICA[oportunidad.metricaNegocio];

  const segmento = contexto?.audienciaObjetivo?.trim()
    ? contexto.audienciaObjetivo.trim()
    : oportunidad.segmentoObjetivo;

  const referencias: string[] = [];
  let anguloMensaje =
    `Para ${brief.marca}, con objetivo de ${brief.objetivo}: conectar con ${segmento.toLowerCase()} ` +
    `a partir de "${oportunidad.senalOrigenEtiqueta}", apalancando el patrocinio del club.`;

  const valores = contexto?.valores?.filter((v) => v.trim().length > 0) ?? [];
  if (valores.length > 0) {
    referencias.push('valores de marca');
    anguloMensaje += ` Enmarcado en los valores de la marca (${valores.join(', ')}).`;
  }
  if (contexto?.tonoVoz?.trim()) {
    referencias.push('tono de voz (ADN)');
    anguloMensaje += ` Tono: ${contexto.tonoVoz.trim()}`;
  }
  if (contexto?.audienciaObjetivo?.trim()) {
    referencias.push('audiencia objetivo');
  }

  const restriccion = contexto?.restriccionesMarca?.trim();
  if (restriccion) referencias.push('restricciones de marca');

  const nota = restriccion
    ? `Respetar las restricciones de marca: ${restriccion}. Concepto base determinista del plano ligero; la generación creativa con IA llega en la Épica 3 (FR-5/FR-6).`
    : 'Concepto base determinista del plano ligero. La generación creativa con IA y el ciclo de aprobación llegan en la Épica 3 (FR-5/FR-6).';

  return {
    oportunidadId: oportunidad.id,
    titulo: `Concepto: ${oportunidad.titulo}`,
    anguloMensaje,
    canalSugerido: canal,
    segmento,
    llamadaAccion: llamada,
    personalizacion: referencias.length > 0 ? 'personalizada' : 'basica',
    referencias,
    nota,
  };
}
