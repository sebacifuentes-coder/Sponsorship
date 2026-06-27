/**
 * ADN de marca (FR-16, Historia 2.2) — entidad de contexto.
 *
 * El ADN de marca captura los valores, tono de voz, identidad visual y
 * posicionamiento de la Marca, que guían la generación creativa (FR-5, Épica 3).
 * Segundo bloque del "Contexto de marca y patrocinio" (PRD §4.9).
 *
 * Pre-relleno asistido por IA: el sistema PROPONE un borrador a partir de la
 * presencia pública de la marca y el CMO lo edita. El borrador entra por un
 * puerto (`BrandDnaPort`, AD-5); hoy lo provee un adaptador semilla determinista
 * y en la Épica 3 lo provee el adaptador de LLM, sin tocar este núcleo.
 *
 * `core/context` es el módulo dueño de esta entidad (AD-7). Captura PROGRESIVA y
 * TTFV-safe (AD-1): el ADN nunca bloquea el primer valor; si falta, la
 * generación usa valores públicos por defecto (Historia 2.5).
 *
 * Dominio puro: sin framework ni proveedores (AD-2).
 */

import { z } from 'zod';
import type { MarcaId, PropiedadId } from '@/core/shared/tenant';

/** Procedencia del ADN vigente: borrador propuesto vs editado por la persona. */
export type OrigenAdn = 'borrador-ia' | 'editado-usuario';

/** Campos editables del ADN de marca (PRD FR-16). */
export interface CamposAdn {
  /** Valores de marca (lista corta). */
  valores: string[];
  /** Tono de voz (cómo comunica la marca). */
  tonoVoz: string;
  /** Identidad visual (rasgos visuales distintivos, en texto). */
  identidadVisual: string;
  /** Posicionamiento (qué lugar ocupa en la mente del público). */
  posicionamiento: string;
}

/** Borrador propuesto por el puerto, antes de editar/guardar. */
export interface BorradorAdn extends CamposAdn {
  /** Aviso honesto sobre cómo se generó el borrador (semilla vs IA real). */
  nota: string;
}

/** ADN de marca persistido y disponible para la generación. */
export interface AdnMarca extends CamposAdn {
  marcaId: MarcaId;
  propiedadId: PropiedadId;
  origen: OrigenAdn;
  /** Sello de última actualización en ISO-8601 UTC. */
  actualizadoEn: string;
}

/** Esquema de los campos del ADN (validación de frontera al guardar/sugerir). */
export const camposAdnSchema = z.object({
  valores: z.array(z.string().min(1).max(60)).max(8).default([]),
  tonoVoz: z.string().max(280).trim().default(''),
  identidadVisual: z.string().max(280).trim().default(''),
  posicionamiento: z.string().max(280).trim().default(''),
});

/** Entrada de guardado del ADN (lo que envía la UI; sin tenant ni sello). */
export const adnEntradaSchema = camposAdnSchema.extend({
  origen: z.enum(['borrador-ia', 'editado-usuario']).default('editado-usuario'),
});

export type AdnEntrada = z.infer<typeof adnEntradaSchema>;

/** ¿El ADN tiene contenido mínimo para personalizar (no está vacío)? */
export function tieneAdnUtil(adn: CamposAdn | null | undefined): boolean {
  if (!adn) return false;
  return (
    adn.valores.length > 0 ||
    adn.tonoVoz.trim().length > 0 ||
    adn.identidadVisual.trim().length > 0 ||
    adn.posicionamiento.trim().length > 0
  );
}
