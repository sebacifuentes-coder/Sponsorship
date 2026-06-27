/**
 * Store en memoria del contexto de marca para el modo demo (sin Supabase).
 *
 * Singleton a nivel de módulo: persiste los derechos registrados durante la
 * sesión de `next dev` y se comparte entre el route handler y las páginas. Viene
 * SEMBRADO con dos marcas de muestra para que el filtrado por derechos
 * (Historia 2.1) sea demostrable sin configurar credenciales (AD-1):
 *   - una marca con derechos digitales/sociales → ve la mayoría de oportunidades;
 *   - una marca con solo derechos físicos → ve cómo el catálogo limita la oferta.
 *
 * Es deliberadamente efímero (no es persistencia real): la persistencia con RLS
 * llega al configurar Supabase (`data/migrations/0004_contexto_derechos.sql`).
 */

import { RepositorioAdnMarcaEnMemoria, RepositorioDerechosEnMemoria } from '@/core/context';
import { DEMO_MARCA_ID, MARCAS_SEMILLA } from '@/lib/context/marcas-semilla';
import { DEMO_PROPIEDAD_ID } from '@/lib/intelligence/clubes-semilla';

// El store se cuelga de globalThis para compartir UNA instancia entre todos los
// bundles del proceso (route handlers y server components corren en módulos
// distintos en `next dev`; globalThis es común a todo el proceso). También
// sobrevive al hot-reload del dev server.
const claveGlobal = globalThis as unknown as {
  __derechosDemo__?: Promise<RepositorioDerechosEnMemoria>;
  __adnDemo__?: RepositorioAdnMarcaEnMemoria;
};

async function sembrar(repo: RepositorioDerechosEnMemoria): Promise<void> {
  // Marca de consumo: derechos digitales/sociales + camiseta.
  await repo.reemplazarDerechos(DEMO_MARCA_ID, DEMO_PROPIEDAD_ID, [
    { tipo: 'contenido_digital', descripcion: 'Contenido en canales del club', activo: true },
    { tipo: 'social_oficial', descripcion: 'Co-publicación en RRSS oficiales', activo: true },
    { tipo: 'camiseta', descripcion: 'Manga de la equipación', activo: true },
  ]);
  // Marca de visibilidad: solo derechos físicos (sin canales digitales).
  const marcaFisica = MARCAS_SEMILLA[1];
  await repo.reemplazarDerechos(marcaFisica.marcaId, marcaFisica.propiedadId, [
    { tipo: 'led_perimetral', descripcion: 'LED en jornadas de liga', activo: true },
    { tipo: 'hospitality', descripcion: 'Palco para 10 invitados', activo: true },
  ]);
}

/** Devuelve el repositorio demo de derechos (singleton de proceso), sembrándolo la primera vez. */
export function repositorioDerechosDemo(): Promise<RepositorioDerechosEnMemoria> {
  if (!claveGlobal.__derechosDemo__) {
    claveGlobal.__derechosDemo__ = (async () => {
      const repo = new RepositorioDerechosEnMemoria();
      await sembrar(repo);
      return repo;
    })();
  }
  return claveGlobal.__derechosDemo__;
}

/**
 * Repositorio demo de ADN de marca (singleton de proceso). Sin sembrar: el ADN
 * arranca vacío para demostrar el flujo de pre-relleno → editar → guardar.
 */
export function repositorioAdnDemo(): RepositorioAdnMarcaEnMemoria {
  if (!claveGlobal.__adnDemo__) {
    claveGlobal.__adnDemo__ = new RepositorioAdnMarcaEnMemoria();
  }
  return claveGlobal.__adnDemo__;
}
