/**
 * Contrato del repositorio de Contexto de marca (AD-7).
 *
 * `core/context` es el módulo dueño del contexto de marca y patrocinio: define
 * el contrato de persistencia, pero no conoce el proveedor (Supabase). La
 * implementación concreta vive en `lib/repositories` (Supabase) y se inyecta en
 * el borde. El dominio nunca importa el proveedor.
 */

import type { MarcaId, PropiedadId } from '@/core/shared/tenant';
import type { DerechoContratado, DerechoEntrada } from '@/core/context/derecho';

export interface RepositorioDerechos {
  /** Lista los derechos contratados de una Marca. */
  listarDerechos(marcaId: MarcaId): Promise<DerechoContratado[]>;
  /**
   * Reemplaza el catálogo completo de derechos de una Marca por el conjunto
   * dado (operación idempotente: registrar/editar el catálogo en un paso).
   * Devuelve el catálogo resultante. AD-7: muta el estado de dominio aquí.
   */
  reemplazarDerechos(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    entradas: DerechoEntrada[],
  ): Promise<DerechoContratado[]>;
}

/**
 * Implementación en memoria — pura, sin proveedor. Sirve para tests y para el
 * modo demo local cuando Supabase aún no está configurado (AD-1: la app corre
 * sin credenciales).
 */
export class RepositorioDerechosEnMemoria implements RepositorioDerechos {
  private readonly porMarca = new Map<MarcaId, DerechoContratado[]>();

  /** Reloj inyectable para tests; por defecto el del sistema (ISO-8601 UTC). */
  constructor(private readonly ahora: () => string = () => new Date().toISOString()) {}

  async listarDerechos(marcaId: MarcaId): Promise<DerechoContratado[]> {
    return (this.porMarca.get(marcaId) ?? []).map((d) => ({ ...d }));
  }

  async reemplazarDerechos(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    entradas: DerechoEntrada[],
  ): Promise<DerechoContratado[]> {
    const registradoEn = this.ahora();
    const derechos: DerechoContratado[] = entradas.map((e) => ({
      id: crypto.randomUUID(),
      marcaId,
      propiedadId,
      tipo: e.tipo,
      descripcion: e.descripcion && e.descripcion.length > 0 ? e.descripcion : null,
      activo: e.activo,
      registradoEn,
    }));
    this.porMarca.set(marcaId, derechos);
    return derechos.map((d) => ({ ...d }));
  }
}
