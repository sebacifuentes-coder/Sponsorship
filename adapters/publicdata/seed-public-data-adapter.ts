/**
 * Adaptador de datos semilla/muestra del PublicDataPort (AD-5).
 *
 * Provee señales públicas AGREGADAS realistas de un club LaLiga de ejemplo,
 * para entregar el primer valor del plano ligero sin atarnos a una API de pago
 * y sin bloquear el TTFV (R-9 del PRD: datos semilla/muestra o conector ligero).
 * Todas las señales son agregadas (cohorte ≥ umbral) y sin PII.
 *
 * Las fuentes reales se enchufan detrás del mismo puerto más adelante
 * ([DECISIÓN PENDIENTE — Seba]); el núcleo no cambia.
 */

import type { PropiedadId } from '@/core/shared/tenant';
import type { PublicDataPort } from '@/ports/public-data-port';
import type { SenalPublicaCruda } from '@/core/intelligence/senal';

const PERIODO_SEMILLA = '2026-Q2';

/** Señales de muestra de un club de consumo masivo de LaLiga (agregadas, sin PII). */
const SENALES_SEMILLA: SenalPublicaCruda[] = [
  // qué BUSCA el hincha (intención) → el momento
  {
    categoria: 'busqueda_intencion',
    clave: 'interes:entradas-partido',
    etiqueta: 'Búsquedas de entradas en semana de partido',
    valor: 38,
    unidad: 'indice',
    tamanoCohorte: 14200,
    fuente: 'semilla:tendencias-busqueda',
    periodo: PERIODO_SEMILLA,
  },
  {
    categoria: 'busqueda_intencion',
    clave: 'interes:camiseta-temporada',
    etiqueta: 'Intención de compra de camiseta de la temporada',
    valor: 21,
    unidad: 'indice',
    tamanoCohorte: 9800,
    fuente: 'semilla:tendencias-busqueda',
    periodo: PERIODO_SEMILLA,
  },
  // qué CONSUME (canal/comportamiento) → la forma
  {
    categoria: 'consumo_canal',
    clave: 'canal:streaming-movil',
    etiqueta: 'Consumo del partido por streaming en móvil',
    valor: 64,
    unidad: '%',
    tamanoCohorte: 26500,
    fuente: 'semilla:panel-consumo',
    periodo: PERIODO_SEMILLA,
  },
  {
    categoria: 'consumo_canal',
    clave: 'canal:delivery-jornada',
    etiqueta: 'Pedidos de delivery durante la jornada',
    valor: 47,
    unidad: 'indice',
    tamanoCohorte: 18300,
    fuente: 'semilla:panel-consumo',
    periodo: PERIODO_SEMILLA,
  },
  // qué OPINA (sentimiento) → el mensaje
  {
    categoria: 'opinion_sentimiento',
    clave: 'sentimiento:rendimiento-equipo',
    etiqueta: 'Sentimiento sobre el rendimiento del equipo',
    valor: 72,
    unidad: '%-positivo',
    tamanoCohorte: 31000,
    fuente: 'semilla:escucha-social',
    periodo: PERIODO_SEMILLA,
  },
  {
    categoria: 'opinion_sentimiento',
    clave: 'sentimiento:fichajes',
    etiqueta: 'Sentimiento sobre los fichajes',
    valor: 58,
    unidad: '%-positivo',
    tamanoCohorte: 12700,
    fuente: 'semilla:escucha-social',
    periodo: PERIODO_SEMILLA,
  },
  // NARRATIVA social → el mensaje
  {
    categoria: 'narrativa_social',
    clave: 'narrativa:cantera-y-orgullo-local',
    etiqueta: 'Narrativa de cantera y orgullo local en alza',
    valor: 33,
    unidad: 'menciones-miles',
    tamanoCohorte: 33000,
    fuente: 'semilla:escucha-social',
    periodo: PERIODO_SEMILLA,
  },
  // SOCIODEMOGRAFÍA agregada → encuadre del público
  {
    categoria: 'sociodemografia',
    clave: 'segmento:18-34-urbano',
    etiqueta: 'Afición 18-34 en núcleos urbanos',
    valor: 41,
    unidad: '%',
    tamanoCohorte: 52000,
    fuente: 'semilla:perfil-audiencia',
    periodo: PERIODO_SEMILLA,
  },
];

export class SeedPublicDataAdapter implements PublicDataPort {
  async obtenerSenales(_propiedadId: PropiedadId): Promise<SenalPublicaCruda[]> {
    // Modo semilla: mismo set de muestra para cualquier club. Devuelve copias
    // para que el núcleo sea dueño de los objetos que normaliza.
    return SENALES_SEMILLA.map((s) => ({ ...s }));
  }
}
