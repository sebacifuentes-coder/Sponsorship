/**
 * Derechos contratados del patrocinio (FR-15, Historia 2.1) — entidad de contexto.
 *
 * Un Derecho contratado es un activo del patrocinio que una Marca tiene
 * efectivamente disponible para activar (camiseta, LED, hospitality, contenido,
 * datos, naming, etc.). Es el primer bloque del "Contexto de marca y patrocinio"
 * (PRD §4.9) que personaliza el motor de oportunidades.
 *
 * `core/context` es el módulo dueño de esta entidad (AD-7). Captura PROGRESIVA y
 * TTFV-safe (AD-1, PRD §4.9): si una Marca aún no tiene catálogo de derechos, el
 * sistema no bloquea el primer valor — opera con los datos públicos por defecto.
 * La regla dura de FR-15 es: cuando hay catálogo, las Oportunidades solo se
 * proponen sobre derechos efectivamente contratados.
 *
 * Dominio puro: sin framework ni proveedores (AD-2).
 */

import { z } from 'zod';
import type { MarcaId, PropiedadId } from '@/core/shared/tenant';
import type { CategoriaSenal } from '@/core/intelligence/senal';
import type { Oportunidad } from '@/core/opportunities/oportunidad';

/** Catálogo cerrado de tipos de derecho del patrocinio (PRD FR-15). */
export const TIPOS_DERECHO = [
  'camiseta',
  'led_perimetral',
  'hospitality',
  'contenido_digital',
  'social_oficial',
  'datos_audiencia',
  'naming',
  'presencia_estadio',
  'experiencias_fan',
  'newsletter',
] as const;

export type TipoDerecho = (typeof TIPOS_DERECHO)[number];

/** Etiqueta legible de cada tipo de derecho (para la UI de gestión). */
export const ETIQUETA_DERECHO: Record<TipoDerecho, string> = {
  camiseta: 'Camiseta (equipación)',
  led_perimetral: 'LED perimetral',
  hospitality: 'Hospitality / palcos',
  contenido_digital: 'Contenido digital del club',
  social_oficial: 'Canales sociales oficiales',
  datos_audiencia: 'Datos de audiencia (vía clean room)',
  naming: 'Naming (estadio / competición)',
  presencia_estadio: 'Presencia en estadio',
  experiencias_fan: 'Experiencias con aficionados',
  newsletter: 'Newsletter / CRM del club',
};

export function esTipoDerecho(valor: unknown): valor is TipoDerecho {
  return typeof valor === 'string' && (TIPOS_DERECHO as readonly string[]).includes(valor);
}

/** Derecho contratado por una Marca, almacenable en el dominio. */
export interface DerechoContratado {
  id: string;
  marcaId: MarcaId;
  /** Tenant: la Propiedad dueña del derecho (multi-tenant — AD-9). */
  propiedadId: PropiedadId;
  tipo: TipoDerecho;
  /** Detalle libre opcional (p. ej. "frontal de camiseta, jornadas de liga"). */
  descripcion: string | null;
  /** Un derecho puede registrarse y luego desactivarse sin borrar el histórico. */
  activo: boolean;
  /** Sello de registro en ISO-8601 UTC. */
  registradoEn: string;
}

/** Entrada de gestión de un derecho (lo que envía la UI; sin identidad ni tenant). */
export const derechoEntradaSchema = z.object({
  tipo: z.enum(TIPOS_DERECHO),
  descripcion: z.string().max(280).trim().optional(),
  activo: z.boolean().default(true),
});

export type DerechoEntrada = z.infer<typeof derechoEntradaSchema>;

/**
 * Versión del mapa derecho↔categoría. Como el resto del plano ligero, el mapeo
 * es DETERMINISTA y versionado (mismo criterio que la priorización, H-16).
 */
export const MAPA_DERECHOS_VERSION = 'derechos-v1';

/**
 * Derechos que pueden CANALIZAR una activación según la categoría de la señal
 * que la origina. Una Oportunidad es proponible si la Marca tiene contratado al
 * menos uno de los derechos elegibles para su categoría.
 *
 * La sociodemografía no genera oportunidad por sí sola (encuadra el segmento),
 * así que no mapea a ningún derecho.
 */
const DERECHOS_ELEGIBLES_POR_CATEGORIA: Record<CategoriaSenal, readonly TipoDerecho[]> = {
  // qué BUSCA el hincha → capturar el momento por canales digitales/datos
  busqueda_intencion: ['contenido_digital', 'social_oficial', 'datos_audiencia', 'newsletter'],
  // qué CONSUME → activar en su canal/forma
  consumo_canal: ['social_oficial', 'contenido_digital', 'newsletter', 'presencia_estadio'],
  // qué OPINA → el mensaje, por contenido y presencia de marca
  opinion_sentimiento: ['social_oficial', 'contenido_digital', 'camiseta'],
  // NARRATIVA social → sumarse de forma auténtica
  narrativa_social: [
    'social_oficial',
    'contenido_digital',
    'experiencias_fan',
    'camiseta',
    'presencia_estadio',
  ],
  sociodemografia: [],
};

/** Derechos que podrían canalizar una oportunidad de esta categoría. */
export function derechosElegiblesPara(categoria: CategoriaSenal): readonly TipoDerecho[] {
  return DERECHOS_ELEGIBLES_POR_CATEGORIA[categoria];
}

/**
 * Limita las Oportunidades a un conjunto de tipos de derecho activos (núcleo
 * puro del filtro). Función determinista compartida por el borde (a partir del
 * catálogo persistido) y por el preview en vivo de la UI.
 *
 * Regla TTFV-safe (AD-1, PRD §4.9): si el conjunto está vacío, NO se filtra — se
 * devuelven todas para no bloquear el primer valor; la personalización se marca
 * como "básica" aguas arriba (Historia 2.5). Con tipos presentes, una
 * Oportunidad sobrevive solo si alguno de los derechos elegibles para su
 * categoría está en el conjunto.
 */
export function limitarPorTipos<O extends Oportunidad>(
  oportunidades: O[],
  tiposActivos: ReadonlySet<TipoDerecho>,
): O[] {
  if (tiposActivos.size === 0) return oportunidades;
  return oportunidades.filter((o) =>
    derechosElegiblesPara(o.categoriaSenal).some((t) => tiposActivos.has(t)),
  );
}

/**
 * Limita las Oportunidades a los derechos efectivamente contratados (FR-15).
 * Deriva el conjunto de tipos activos del catálogo y delega en `limitarPorTipos`.
 */
export function limitarADerechosContratados<O extends Oportunidad>(
  oportunidades: O[],
  derechosContratados: readonly DerechoContratado[],
): O[] {
  const tiposActivos = new Set(
    derechosContratados.filter((d) => d.activo).map((d) => d.tipo),
  );
  return limitarPorTipos(oportunidades, tiposActivos);
}
