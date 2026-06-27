/**
 * Generación del mapa de oportunidades sobre datos públicos (FR-3, Historia 1.3).
 *
 * Lógica de dominio determinista (sin IA): mapea cada señal pública accionable a
 * una Oportunidad con segmento objetivo, señal de origen e hipótesis de valor de
 * negocio. La generación de *creatividad* con IA es otra cosa (FR-5, Épica 3);
 * aquí solo se arma el mapa de qué se puede hacer.
 *
 * AD-1: plano ligero, no depende del plano profundo.
 */

import type { SenalPublica, CategoriaSenal } from '@/core/intelligence/senal';
import type { MetricaNegocio, Oportunidad } from '@/core/opportunities/oportunidad';

/** Mínimo de señales accionables para poder proponer oportunidades. */
export const UMBRAL_SENALES_MINIMAS = 1;

/** Categorías que generan oportunidad por sí solas (excluye sociodemografía). */
type CategoriaAccionable =
  | 'busqueda_intencion'
  | 'consumo_canal'
  | 'opinion_sentimiento'
  | 'narrativa_social';

/** Las señales sociodemográficas encuadran el segmento; no generan oportunidad por sí solas. */
const CATEGORIAS_ACCIONABLES: readonly CategoriaAccionable[] = [
  'busqueda_intencion',
  'consumo_canal',
  'opinion_sentimiento',
  'narrativa_social',
];

function esAccionable(c: CategoriaSenal): c is CategoriaAccionable {
  return (CATEGORIAS_ACCIONABLES as readonly string[]).includes(c);
}

interface PlantillaCategoria {
  metrica: MetricaNegocio;
  titulo: (s: SenalPublica) => string;
  hipotesis: (s: SenalPublica, segmento: string) => string;
}

const PLANTILLAS: Record<CategoriaAccionable, PlantillaCategoria> = {
  // qué BUSCA el hincha → activar en el momento correcto
  busqueda_intencion: {
    metrica: 'conversion',
    titulo: (s) => `Capturar la intención: ${s.etiqueta.toLowerCase()}`,
    hipotesis: (s, seg) =>
      `${seg} muestra intención ("${s.etiqueta}", ${s.valor} ${s.unidad}). Activar en ese momento debería convertir intención en negocio trazable.`,
  },
  // qué CONSUME → llegar por la forma/canal correcta
  consumo_canal: {
    metrica: 'engagement',
    titulo: (s) => `Activar en el canal: ${s.etiqueta.toLowerCase()}`,
    hipotesis: (s, seg) =>
      `${seg} consume por este canal ("${s.etiqueta}", ${s.valor} ${s.unidad}). Activar ahí maximiza alcance útil y engagement.`,
  },
  // qué OPINA → el mensaje correcto
  opinion_sentimiento: {
    metrica: 'afinidad',
    titulo: (s) => `Alinear el mensaje con: ${s.etiqueta.toLowerCase()}`,
    hipotesis: (s, seg) =>
      `El sentimiento de ${seg.toLowerCase()} ("${s.etiqueta}", ${s.valor} ${s.unidad}) marca el tono. Un mensaje alineado mejora afinidad de marca.`,
  },
  // NARRATIVA social → el mensaje correcto
  narrativa_social: {
    metrica: 'awareness',
    titulo: (s) => `Sumarse a la narrativa: ${s.etiqueta.toLowerCase()}`,
    hipotesis: (s, seg) =>
      `Hay narrativa pública en alza ("${s.etiqueta}", ${s.valor} ${s.unidad}) entre ${seg.toLowerCase()}. Sumarse de forma auténtica gana awareness y afinidad.`,
  },
};

/** Deriva el segmento objetivo base de la señal sociodemográfica dominante. */
function segmentoBase(senales: SenalPublica[]): string {
  const socio = senales
    .filter((s) => s.categoria === 'sociodemografia')
    .sort((a, b) => b.valor - a.valor)[0];
  return socio ? socio.etiqueta : 'Afición general del club';
}

/**
 * Genera el mapa de oportunidades. Devuelve `[]` si no hay señales accionables
 * suficientes — la UI muestra entonces un estado vacío claro (AC 1.3).
 */
export function generarOportunidades(senales: SenalPublica[]): Oportunidad[] {
  const accionables = senales.filter((s) => esAccionable(s.categoria));
  if (accionables.length < UMBRAL_SENALES_MINIMAS) {
    return [];
  }

  const segmento = segmentoBase(senales);

  return accionables.map((senal) => {
    const plantilla = PLANTILLAS[senal.categoria as CategoriaAccionable];
    return {
      id: crypto.randomUUID(),
      propiedadId: senal.propiedadId,
      titulo: plantilla.titulo(senal),
      segmentoObjetivo: segmento,
      senalOrigenId: senal.id,
      senalOrigenEtiqueta: senal.etiqueta,
      categoriaSenal: senal.categoria,
      hipotesisValor: plantilla.hipotesis(senal, segmento),
      metricaNegocio: plantilla.metrica,
    };
  });
}
