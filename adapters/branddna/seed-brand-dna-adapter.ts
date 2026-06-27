/**
 * Adaptador semilla de ADN de marca del BrandDnaPort (AD-5).
 *
 * Propone un borrador de ADN DETERMINISTA a partir del nombre y el sector de la
 * Marca, para que el primer relleno no parta de cero y sin atarnos a un LLM
 * todavía (la generación con IA real es la Épica 3). El borrador es editable y
 * lleva un aviso honesto de su origen.
 *
 * Cuando entre el adaptador de LLM (Épica 3) se reimplementa este puerto con
 * generación real; el núcleo no cambia (AD-5).
 */

import type { BrandDnaPort, PistasMarca } from '@/ports/brand-dna-port';
import type { BorradorAdn } from '@/core/context/adn-marca';

/** Valores base por sector (heurística semilla; el LLM los afinará en Épica 3). */
const VALORES_POR_SECTOR: Record<string, string[]> = {
  ecommerce: ['Cercanía', 'Inmediatez', 'Confianza'],
  delivery: ['Rapidez', 'Conveniencia', 'Frescura'],
  consumo: ['Autenticidad', 'Cotidianidad', 'Calidad'],
  fintech: ['Transparencia', 'Seguridad', 'Simplicidad'],
  telco: ['Conexión', 'Cobertura', 'Innovación'],
  banca: ['Solidez', 'Confianza', 'Cercanía'],
  default: ['Pasión', 'Cercanía', 'Compromiso'],
};

function valoresDe(sector?: string): string[] {
  const clave = (sector ?? '').toLowerCase().trim();
  return VALORES_POR_SECTOR[clave] ?? VALORES_POR_SECTOR.default;
}

export class SeedBrandDnaAdapter implements BrandDnaPort {
  async sugerirBorrador(pistas: PistasMarca): Promise<BorradorAdn> {
    const { nombre, sector } = pistas;
    const valores = valoresDe(sector);
    const etiquetaSector = sector && sector.trim().length > 0 ? sector.trim() : 'su categoría';

    return {
      valores,
      tonoVoz: `Cercano y directo, con orgullo de pertenencia al fútbol. ${nombre} habla de tú a tú al hincha, sin tecnicismos.`,
      identidadVisual: `Identidad reconocible de ${nombre}, integrada con los colores y el universo visual del club sin competir con ellos.`,
      posicionamiento: `${nombre} como marca aliada del hincha en ${etiquetaSector}, que aporta valor real alrededor del patrocinio.`,
      nota: 'Borrador semilla determinista a partir del nombre y sector. La propuesta con IA real (presencia pública de la marca) llega en la Épica 3; edítalo libremente.',
    };
  }
}
