/**
 * Marcas semilla para el contexto de marca (Historia 2.1, client-safe).
 *
 * Lista de muestra de Marcas patrocinadoras asociadas a las Propiedades semilla
 * (`lib/intelligence/clubes-semilla`). En modo demo (sin Supabase) sirven para
 * registrar derechos y demostrar el filtrado de oportunidades por derechos
 * contratados. Se mapean a Marcas reales cuando entren (Épica 4 / P-1).
 */

import { DEMO_PROPIEDAD_ID } from '@/lib/intelligence/clubes-semilla';

/** Marca de demostración para el modo local sin Supabase. */
export const DEMO_MARCA_ID = '00000000-0000-4000-8000-0000000000a1';

export interface MarcaSemilla {
  marcaId: string;
  propiedadId: string;
  nombre: string;
}

export const MARCAS_SEMILLA: MarcaSemilla[] = [
  { marcaId: DEMO_MARCA_ID, propiedadId: DEMO_PROPIEDAD_ID, nombre: 'Marca Consumo Demo (e-commerce)' },
  {
    marcaId: '00000000-0000-4000-8000-0000000000a2',
    propiedadId: DEMO_PROPIEDAD_ID,
    nombre: 'Marca Visibilidad Demo (solo derechos físicos)',
  },
  {
    // Sin contexto sembrado: demuestra el fallback de personalización "básica".
    marcaId: '00000000-0000-4000-8000-0000000000a3',
    propiedadId: DEMO_PROPIEDAD_ID,
    nombre: 'Marca Nueva Demo (sin contexto)',
  },
];

export function marcaSemillaPorId(marcaId: string): MarcaSemilla | undefined {
  return MARCAS_SEMILLA.find((m) => m.marcaId === marcaId);
}
