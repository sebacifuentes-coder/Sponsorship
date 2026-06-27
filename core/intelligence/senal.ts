/**
 * Señal pública — materia prima del plano ligero (FR-3, FR-14).
 *
 * El Almacén de Inteligencia Pública contiene SOLO señales agregadas del club y
 * del hincha, sin PII (AD-3). Cada señal mapea a la estrella polar del producto:
 *   - qué BUSCA el hincha (intención) → el *momento* correcto
 *   - qué CONSUME (comportamiento/canal) → la *forma/canal* correcta
 *   - qué OPINA / su NARRATIVA social → el *mensaje* correcto
 *   - sociodemografía agregada → encuadre del público
 *
 * Anti-perfilado (GDPR, PRD §16): bajo GDPR el dato personal sigue protegido
 * aunque sea público; el primer valor no perfila individuos, solo la afición en
 * agregado. Por eso toda señal exige un tamaño de cohorte mínimo y se prohíbe
 * cualquier identificador por-fan.
 */

import { z } from 'zod';
import type { PropiedadId } from '@/core/shared/tenant';

/** Categorías de señal (mapean a la estrella polar). */
export const CATEGORIAS_SENAL = [
  'busqueda_intencion',
  'consumo_canal',
  'opinion_sentimiento',
  'narrativa_social',
  'sociodemografia',
] as const;

export type CategoriaSenal = (typeof CATEGORIAS_SENAL)[number];

/**
 * Umbral mínimo de agregación: ninguna señal puede describir una cohorte menor.
 * Hace cumplir "agregados/anonimizados, sin perfilar individuos" (PRD §16).
 * (El k-mínimo del Clean Room — AD-8 — es un control distinto y más estricto,
 * propio del plano profundo; se aborda en la Épica 4.)
 */
export const UMBRAL_AGREGACION = 50;

/** Términos prohibidos: detectan intentos de colar PII por nombre de campo. */
const TERMINOS_PII_PROHIBIDOS = [
  'email',
  'correo',
  'dni',
  'nif',
  'telefono',
  'phone',
  'nombre',
  'apellido',
  'direccion',
  'ip',
  'user_id',
  'fan_id',
  'id_fan',
];

/**
 * Detecta PII por *token* completo (límite de palabra), no por substring, para
 * no marcar falsos positivos como "equ**ip**o". Las claves son estructuradas
 * (`prefijo:segmento-con-guiones`), así que los guiones/dos puntos actúan como
 * separadores.
 */
function contienePII(texto: string): boolean {
  const t = texto.toLowerCase();
  return TERMINOS_PII_PROHIBIDOS.some((termino) =>
    new RegExp(`\\b${termino}\\b`).test(t),
  );
}

/**
 * Señal cruda tal como la entrega una fuente pública (vía `PublicDataPort`).
 * Validada en la frontera de ingesta antes de entrar al dominio.
 */
export const senalPublicaCrudaSchema = z
  .object({
    categoria: z.enum(CATEGORIAS_SENAL),
    /** Clave estable de la señal, p. ej. `interes:running`. */
    clave: z.string().min(1),
    /** Etiqueta legible, p. ej. "Interés en running". */
    etiqueta: z.string().min(1),
    /** Valor agregado de la métrica. */
    valor: z.number().finite(),
    /** Unidad del valor: `%`, `indice`, `menciones`, etc. */
    unidad: z.string().min(1),
    /** Tamaño de la cohorte agregada (anti-perfilado). */
    tamanoCohorte: z.number().int().min(UMBRAL_AGREGACION),
    /** Procedencia de la señal (trazabilidad — AC de la Historia 1.2). */
    fuente: z.string().min(1),
    /** Periodo al que corresponde la señal, p. ej. `2026-Q2`. */
    periodo: z.string().min(1),
  })
  .refine((s) => !contienePII(s.clave), {
    message: 'La clave de la señal no puede contener identificadores por-fan (PII).',
  });

export type SenalPublicaCruda = z.infer<typeof senalPublicaCrudaSchema>;

/**
 * Señal pública normalizada y almacenable en el dominio. Añade identidad,
 * tenant (Propiedad) y sello de ingesta (fuente ya viene en la cruda).
 */
export interface SenalPublica extends SenalPublicaCruda {
  id: string;
  propiedadId: PropiedadId;
  /** Momento de ingesta en ISO-8601 UTC (AC: cada señal registra su fecha). */
  ingestadoEn: string;
}

/**
 * Valida una señal cruda y la normaliza a señal de dominio. Lanza si la señal
 * no es agregada o contiene PII (rechazo en la frontera — AD-3).
 */
export function normalizarSenal(
  cruda: unknown,
  propiedadId: PropiedadId,
  ingestadoEn: string,
): SenalPublica {
  const valida = senalPublicaCrudaSchema.parse(cruda);
  return {
    ...valida,
    id: crypto.randomUUID(),
    propiedadId,
    ingestadoEn,
  };
}
