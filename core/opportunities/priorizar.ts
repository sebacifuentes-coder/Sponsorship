/**
 * Priorización de oportunidades por valor potencial (FR-4, Historia 1.4).
 *
 * Método de estimación TRANSPARENTE y VERSIONADO (resuelve H-16): cada estimado
 * expone su métrica, su supuesto y su confianza, y referencia la versión del
 * método. El cálculo es determinista y explicable — no una caja negra.
 *
 * Estimado (0–100) = 100 · pesoCategoría · factorAlcance · intensidadSeñal
 *   - pesoCategoría: cuán cerca está la categoría del negocio (conversión > awareness).
 *   - factorAlcance: tamaño de la cohorte agregada, saturado.
 *   - intensidadSeñal: el valor de la señal normalizado por su unidad.
 */

import type { CategoriaSenal, SenalPublica } from '@/core/intelligence/senal';
import type {
  Confianza,
  Oportunidad,
  OportunidadPriorizada,
} from '@/core/opportunities/oportunidad';

export const METODO_PRIORIZACION_VERSION = 'priorizacion-v1';

/** Alcance de referencia para saturar el factor de cohorte. */
const ALCANCE_REFERENCIA = 50_000;

/** Peso de la categoría según su cercanía al negocio. */
const PESO_CATEGORIA: Record<CategoriaSenal, number> = {
  busqueda_intencion: 1.0,
  consumo_canal: 0.8,
  opinion_sentimiento: 0.6,
  narrativa_social: 0.5,
  sociodemografia: 0.4,
};

/** Normaliza el valor de la señal a 0–1 según su unidad. */
function intensidadSenal(valor: number, unidad: string): number {
  const u = unidad.toLowerCase();
  if (u.includes('%')) return clamp01(valor / 100);
  if (u.includes('indice')) return clamp01(valor / 100);
  if (u.includes('menciones')) return clamp01(valor / 50);
  return clamp01(valor / 100);
}

function factorAlcance(tamanoCohorte: number): number {
  return clamp01(tamanoCohorte / ALCANCE_REFERENCIA);
}

function confianzaDe(tamanoCohorte: number): Confianza {
  if (tamanoCohorte >= 30_000) return 'alta';
  if (tamanoCohorte >= 15_000) return 'media';
  return 'baja';
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/**
 * Asigna valor potencial a una oportunidad usando su señal de origen y ordena
 * de mayor a menor estimado. Necesita las señales para leer alcance/intensidad.
 */
export function priorizarOportunidades(
  oportunidades: Oportunidad[],
  senales: SenalPublica[],
): OportunidadPriorizada[] {
  const porId = new Map(senales.map((s) => [s.id, s]));

  const priorizadas = oportunidades.map((o): OportunidadPriorizada => {
    const senal = porId.get(o.senalOrigenId);
    const peso = PESO_CATEGORIA[o.categoriaSenal];

    const alcance = senal ? factorAlcance(senal.tamanoCohorte) : 0.3;
    const intensidad = senal ? intensidadSenal(senal.valor, senal.unidad) : 0.3;
    const estimado = Math.round(100 * peso * alcance * intensidad);

    const cohorte = senal?.tamanoCohorte ?? 0;
    const supuesto = senal
      ? `Peso de categoría ${peso.toFixed(2)} (${o.categoriaSenal}), alcance ≈ ${cohorte.toLocaleString('es-ES')} hinchas y señal "${senal.etiqueta}" (${senal.valor} ${senal.unidad}).`
      : 'Señal de origen no disponible; estimado conservador por defecto.';

    return {
      ...o,
      valorPotencial: {
        estimado,
        metrica: o.metricaNegocio,
        supuesto,
        confianza: senal ? confianzaDe(senal.tamanoCohorte) : 'baja',
        metodoVersion: METODO_PRIORIZACION_VERSION,
      },
    };
  });

  return priorizadas.sort((a, b) => b.valorPotencial.estimado - a.valorPotencial.estimado);
}
