/**
 * Contrato del Almacén de Inteligencia Pública (AD-7).
 *
 * `core/intelligence` es el módulo dueño de las señales públicas: define el
 * contrato de persistencia, pero no conoce el proveedor (Supabase). La
 * implementación concreta vive en `lib/repositories` (Supabase) y se inyecta en
 * el borde (route handler / worker). El dominio nunca importa el proveedor.
 */

import type { PropiedadId } from '@/core/shared/tenant';
import type { SenalPublica } from '@/core/intelligence/senal';

export interface AlmacenInteligenciaPublica {
  /** Persiste señales agregadas (sin PII). Append: la ingesta acumula histórico. */
  guardarSenales(senales: SenalPublica[]): Promise<void>;
  /** Lista las señales de una Propiedad (club). */
  listarSenales(propiedadId: PropiedadId): Promise<SenalPublica[]>;
}

/**
 * Implementación en memoria — pura, sin proveedor. Sirve para tests y para el
 * modo demo local cuando Supabase aún no está configurado (AD-1: la app corre
 * sin credenciales).
 */
export class AlmacenInteligenciaPublicaEnMemoria implements AlmacenInteligenciaPublica {
  private readonly porPropiedad = new Map<PropiedadId, SenalPublica[]>();

  async guardarSenales(senales: SenalPublica[]): Promise<void> {
    for (const senal of senales) {
      const actuales = this.porPropiedad.get(senal.propiedadId) ?? [];
      actuales.push(senal);
      this.porPropiedad.set(senal.propiedadId, actuales);
    }
  }

  async listarSenales(propiedadId: PropiedadId): Promise<SenalPublica[]> {
    return this.porPropiedad.get(propiedadId) ?? [];
  }
}
