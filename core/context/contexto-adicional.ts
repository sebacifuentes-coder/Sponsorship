/**
 * Contexto adicional de la Marca (FR-18, Historia 2.4) — contexto.
 *
 * Cuarto bloque del "Contexto de marca y patrocinio" (PRD §4.9): audiencia
 * objetivo, calendario, productos/mensajes a impulsar, restricciones de marca y
 * mercados. Lo referencian las oportunidades y la generación (Historia 2.5 /
 * Épica 3) para dejar de ser genéricas.
 *
 * Captura PROGRESIVA: TODOS los campos son opcionales y NUNCA bloquean el primer
 * valor (AD-1, PRD §4.9). Sin contexto mínimo, el sistema usa valores públicos
 * por defecto y marca la personalización como "básica" (Historia 2.5).
 *
 * `core/context` es el módulo dueño de esta entidad (AD-7). Dominio puro (AD-2).
 */

import { z } from 'zod';
import type { MarcaId, PropiedadId } from '@/core/shared/tenant';

/** Campos editables del contexto adicional (PRD FR-18). Todos opcionales. */
export interface CamposContextoAdicional {
  /** Audiencia objetivo de la Marca (a quién quiere llegar). */
  audienciaObjetivo: string;
  /** Calendario relevante (fechas clave, campañas, lanzamientos). */
  calendario: string;
  /** Productos o mensajes a impulsar. */
  productosMensajes: string;
  /** Restricciones de marca (qué no se puede hacer/decir). */
  restriccionesMarca: string;
  /** Mercados objetivo (geografías). */
  mercados: string;
}

/** Contexto adicional persistido y referenciable. */
export interface ContextoAdicional extends CamposContextoAdicional {
  marcaId: MarcaId;
  propiedadId: PropiedadId;
  actualizadoEn: string;
}

/** Esquema de captura: todos los campos opcionales (captura progresiva). */
export const contextoAdicionalEntradaSchema = z.object({
  audienciaObjetivo: z.string().max(280).trim().default(''),
  calendario: z.string().max(280).trim().default(''),
  productosMensajes: z.string().max(280).trim().default(''),
  restriccionesMarca: z.string().max(280).trim().default(''),
  mercados: z.string().max(280).trim().default(''),
});

export type ContextoAdicionalEntrada = z.infer<typeof contextoAdicionalEntradaSchema>;

/** ¿El contexto adicional tiene algún campo con contenido? */
export function tieneContextoAdicional(
  ctx: CamposContextoAdicional | null | undefined,
): boolean {
  if (!ctx) return false;
  return [
    ctx.audienciaObjetivo,
    ctx.calendario,
    ctx.productosMensajes,
    ctx.restriccionesMarca,
    ctx.mercados,
  ].some((v) => v.trim().length > 0);
}
