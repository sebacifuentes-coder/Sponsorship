/**
 * Caso de uso: ingestar señales públicas (Historia 1.2, FR-3/FR-14).
 *
 * Pipeline: fuente pública (PublicDataPort) → validación de frontera (sin PII,
 * agregadas) → sello de procedencia y fecha → Almacén de Inteligencia Pública.
 *
 * AD-7: la mutación del estado de dominio ocurre aquí, en `core/`. El adaptador
 * de la fuente y el almacén se inyectan; el adaptador ejecuta, no decide.
 * AD-1: vive en el plano ligero; no depende del plano profundo.
 */

import type { PropiedadId } from '@/core/shared/tenant';
import type { PublicDataPort } from '@/ports/public-data-port';
import type { AlmacenInteligenciaPublica } from '@/core/intelligence/repository';
import { normalizarSenal, type SenalPublica } from '@/core/intelligence/senal';

export interface DependenciasIngesta {
  fuente: PublicDataPort;
  almacen: AlmacenInteligenciaPublica;
  /** Inyectable para tests; por defecto, el reloj del sistema (ISO-8601 UTC). */
  ahora?: () => string;
}

export interface ResultadoIngesta {
  propiedadId: PropiedadId;
  ingestadas: number;
  senales: SenalPublica[];
}

export async function ingestarSenalesPublicas(
  deps: DependenciasIngesta,
  propiedadId: PropiedadId,
): Promise<ResultadoIngesta> {
  const ahora = deps.ahora ?? (() => new Date().toISOString());

  const crudas = await deps.fuente.obtenerSenales(propiedadId);

  // Validación de frontera: cualquier señal no-agregada o con PII lanza aquí y
  // aborta la ingesta — nada con PII entra al almacén (AD-3).
  const ingestadoEn = ahora();
  const senales = crudas.map((cruda) => normalizarSenal(cruda, propiedadId, ingestadoEn));

  await deps.almacen.guardarSenales(senales);

  return { propiedadId, ingestadas: senales.length, senales };
}
