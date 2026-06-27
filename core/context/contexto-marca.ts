/**
 * Contexto de marca agregado (Historia 2.5) — une los cuatro bloques.
 *
 * Reúne Derechos (FR-15), ADN (FR-16), Objetivos (FR-17) y Contexto adicional
 * (FR-18) de una Marca para personalizar las oportunidades y la generación
 * (PRD §4.9). Cuando hay contexto, las recomendaciones lo referencian; sin
 * contexto mínimo, el sistema usa valores públicos por defecto y marca la
 * personalización como "básica" (captura progresiva, TTFV-safe — AD-1).
 *
 * `core/context` es el dueño de esta vista agregada (AD-7). Dominio puro (AD-2).
 */

import type { DerechoContratado } from '@/core/context/derecho';
import type { AdnMarca } from '@/core/context/adn-marca';
import { tieneAdnUtil } from '@/core/context/adn-marca';
import type { ObjetivoComunicacion } from '@/core/context/objetivos';
import type { ContextoAdicional } from '@/core/context/contexto-adicional';
import { tieneContextoAdicional } from '@/core/context/contexto-adicional';

/** Vista agregada del contexto de una Marca. */
export interface ContextoMarca {
  derechos: DerechoContratado[];
  adn: AdnMarca | null;
  objetivos: ObjetivoComunicacion[];
  contextoAdicional: ContextoAdicional | null;
}

/** Nivel de personalización derivado del contexto disponible. */
export type NivelPersonalizacion = 'basica' | 'personalizada';

/** Contexto vacío: sin ningún bloque registrado (personalización básica). */
export const CONTEXTO_MARCA_VACIO: ContextoMarca = {
  derechos: [],
  adn: null,
  objetivos: [],
  contextoAdicional: null,
};

/**
 * Resumen de qué bloques del contexto están presentes y el nivel resultante.
 * Lo usan la generación y la UI para referenciar el contexto y avisar cuando la
 * personalización es básica.
 */
export interface ResumenPersonalizacion {
  nivel: NivelPersonalizacion;
  /** Etiquetas legibles de los bloques referenciados (vacío si básica). */
  referencias: string[];
}

export function resumenPersonalizacion(ctx: ContextoMarca): ResumenPersonalizacion {
  const referencias: string[] = [];

  const derechosActivos = ctx.derechos.filter((d) => d.activo).length;
  if (derechosActivos > 0) {
    referencias.push(`${derechosActivos} derecho${derechosActivos === 1 ? '' : 's'} contratado${derechosActivos === 1 ? '' : 's'}`);
  }
  if (tieneAdnUtil(ctx.adn)) referencias.push('ADN de marca');
  if (ctx.objetivos.length > 0) referencias.push(`objetivos: ${ctx.objetivos.join(', ')}`);
  if (tieneContextoAdicional(ctx.contextoAdicional)) referencias.push('contexto adicional');

  return {
    nivel: referencias.length > 0 ? 'personalizada' : 'basica',
    referencias,
  };
}

/** Atajo: ¿hay contexto suficiente para personalizar (no básica)? */
export function nivelPersonalizacion(ctx: ContextoMarca): NivelPersonalizacion {
  return resumenPersonalizacion(ctx).nivel;
}
