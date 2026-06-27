/**
 * Tenancy del dominio — multi-tenant por Propiedad (AD-9).
 *
 * El aislamiento es *por Propiedad*: una Propiedad nunca ve datos de otra.
 * El Clean Room exige aislamiento reforzado por Propiedad (más que una columna
 * `tenant_id`); eso se implementa en la Historia 4.1. Aquí solo viven los
 * tipos transversales del dominio.
 */

/** Identificador de una Propiedad (club/liga/federación). UUID v4 (convención del spine). */
export type PropiedadId = string;

/** Identificador de una Marca patrocinadora. UUID v4. */
export type MarcaId = string;

/**
 * Contexto de tenant resuelto para una petición. Lo produce la capa de auth
 * (`lib/auth`) a partir del perfil del usuario y se propaga al dominio.
 */
export interface ContextoTenant {
  /** Propiedad activa. `null` solo para el Consultor en vista multi-cliente sin foco. */
  propiedadId: PropiedadId | null;
  /** Marca activa, cuando el actor opera en el contexto de una Marca. */
  marcaId: MarcaId | null;
}
