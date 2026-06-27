/**
 * Lector de borde del Contexto de marca agregado (Historia 2.5).
 *
 * Reúne en paralelo los cuatro bloques (derechos, ADN, objetivos, contexto
 * adicional) de una Marca y devuelve el agregado `ContextoMarca` del dominio.
 * Compone proveedor + núcleo en el borde; el núcleo no conoce esta wiring.
 */

import { leerDerechos } from '@/lib/context/leer-derechos';
import { leerAdn } from '@/lib/context/adn-marca-service';
import { leerObjetivos } from '@/lib/context/objetivos-service';
import { leerContextoAdicional } from '@/lib/context/contexto-adicional-service';
import type { ContextoMarca } from '@/core/context';
import type { MarcaId } from '@/core/shared/tenant';

export async function leerContextoMarca(marcaId: MarcaId): Promise<ContextoMarca> {
  const [derechos, adn, objetivos, contextoAdicional] = await Promise.all([
    leerDerechos(marcaId),
    leerAdn(marcaId),
    leerObjetivos(marcaId),
    leerContextoAdicional(marcaId),
  ]);
  return { derechos, adn, objetivos, contextoAdicional };
}
