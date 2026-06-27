/**
 * PublicDataPort — contrato hacia las fuentes de datos públicos (AD-5).
 *
 * El núcleo obtiene señales públicas del club y del hincha sin conocer al
 * proveedor. Hoy lo implementa un adaptador de datos semilla/muestra
 * (`adapters/publicdata`); mañana, conectores reales (API deportiva,
 * intención/búsqueda, consumo, opinión/narrativa) — sin tocar el núcleo.
 *
 * Las fuentes reales por categoría quedan como [DECISIÓN PENDIENTE — Seba]:
 * se cablean detrás de este puerto cuando se elijan proveedor(es) y base legal.
 */

import type { PropiedadId } from '@/core/shared/tenant';
import type { SenalPublicaCruda } from '@/core/intelligence/senal';

export interface PublicDataPort {
  /**
   * Devuelve señales públicas AGREGADAS de la Propiedad (club). El adaptador no
   * persiste ni decide: solo provee. La validación anti-PII la hace el núcleo.
   */
  obtenerSenales(propiedadId: PropiedadId): Promise<SenalPublicaCruda[]>;
}
