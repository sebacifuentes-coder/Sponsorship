/**
 * BrandDnaPort — contrato hacia la sugerencia de ADN de marca (AD-5).
 *
 * El núcleo obtiene un borrador de ADN de marca a partir de la presencia pública
 * de la Marca, sin conocer al proveedor. Hoy lo implementa un adaptador semilla
 * determinista (`adapters/branddna`); en la Épica 3, el adaptador de LLM
 * (Azure/Google vía AI SDK) lo provee con generación real — sin tocar el núcleo.
 *
 * La fuente real (LLM + scraping de presencia pública) queda como decisión de la
 * Épica 3; se cablea detrás de este puerto.
 */

import type { MarcaId, PropiedadId } from '@/core/shared/tenant';
import type { BorradorAdn } from '@/core/context/adn-marca';

export interface PistasMarca {
  marcaId: MarcaId;
  propiedadId: PropiedadId;
  /** Nombre público de la Marca; base del borrador. */
  nombre: string;
  /** Sector/categoría declarado (opcional), afina el borrador. */
  sector?: string;
}

export interface BrandDnaPort {
  /**
   * Propone un borrador de ADN a partir de la presencia pública de la marca.
   * El adaptador no persiste ni decide: solo propone. La persona edita y guarda.
   */
  sugerirBorrador(pistas: PistasMarca): Promise<BorradorAdn>;
}
