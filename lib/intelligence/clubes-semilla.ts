/**
 * Clubes semilla para el onboarding del MVP (Historia 1.5).
 *
 * Lista de muestra de Propiedades (clubes LaLiga) para el selector del primer
 * paso. En el modo semilla el adaptador público devuelve el mismo set de
 * señales para cualquier club; la elección es real para el flujo y queda lista
 * para mapearse a Propiedades reales cuando entren (Épica 4 / P-4).
 */

/** Propiedad de demostración para el modo local sin Supabase (client-safe). */
export const DEMO_PROPIEDAD_ID = '00000000-0000-4000-8000-000000000001';

export interface ClubSemilla {
  propiedadId: string;
  nombre: string;
}

export const CLUBES_SEMILLA: ClubSemilla[] = [
  { propiedadId: DEMO_PROPIEDAD_ID, nombre: 'Club Atlético Demo' },
  { propiedadId: '00000000-0000-4000-8000-000000000002', nombre: 'Real Costa FC' },
  { propiedadId: '00000000-0000-4000-8000-000000000003', nombre: 'Deportivo Ribera' },
];

export const OBJETIVOS_COMUNICACION = [
  'awareness',
  'consideracion',
  'conversion',
  'lanzamiento',
] as const;

export type ObjetivoComunicacion = (typeof OBJETIVOS_COMUNICACION)[number];
