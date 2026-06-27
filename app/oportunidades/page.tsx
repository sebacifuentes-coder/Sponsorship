import Link from "next/link";

import { leerSenalesPublicas, DEMO_PROPIEDAD_ID } from "@/lib/intelligence/leer-senales";
import { generarOportunidades, priorizarOportunidades } from "@/core/opportunities";
import { limitarADerechosContratados, metricasFavorecidas } from "@/core/context";
import { leerDerechos } from "@/lib/context/leer-derechos";
import { leerObjetivos } from "@/lib/context/objetivos-service";
import { MARCAS_SEMILLA, marcaSemillaPorId } from "@/lib/context/marcas-semilla";
import { OportunidadesLista } from "@/components/oportunidades-lista";
import { MarcaSelector } from "@/components/marca-selector";

export const metadata = {
  title: "Mapa de oportunidades · Copiloto de Patrocinio",
};

export default async function OportunidadesPage({
  searchParams,
}: {
  searchParams: Promise<{ marca?: string }>;
}) {
  const { marca: marcaId } = await searchParams;
  const marca = marcaId ? marcaSemillaPorId(marcaId) : undefined;

  const senales = await leerSenalesPublicas(DEMO_PROPIEDAD_ID);
  const generadas = generarOportunidades(senales);

  // Con una Marca seleccionada: la priorización toma en cuenta sus objetivos de
  // comunicación vigentes (FR-17, Historia 2.3) y la propuesta se limita a sus
  // derechos contratados (FR-15). Sin marca → mapa público base (Historia 1.4).
  let oportunidades = priorizarOportunidades(generadas, senales);
  let derechosCount = 0;
  let objetivos: string[] = [];
  if (marca) {
    const [derechos, objetivosMarca] = await Promise.all([
      leerDerechos(marca.marcaId),
      leerObjetivos(marca.marcaId),
    ]);
    objetivos = objetivosMarca;
    derechosCount = derechos.filter((d) => d.activo).length;
    const priorizadas = priorizarOportunidades(
      generadas,
      senales,
      metricasFavorecidas(objetivosMarca),
    );
    oportunidades = limitarADerechosContratados(priorizadas, derechos);
  }

  const marcasPropiedad = MARCAS_SEMILLA.filter((m) => m.propiedadId === DEMO_PROPIEDAD_ID);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:underline"
        >
          ← Inicio
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Mapa de oportunidades
        </h1>
        <p className="text-sm text-muted-foreground">
          Derivado de {senales.length} señales públicas agregadas del club y del
          hincha (sin PII), ordenado por valor potencial estimado. La precisión se
          elevará con datos first-party.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <MarcaSelector marcas={marcasPropiedad} marcaSeleccionada={marcaId ?? null} />
        {marca && (
          <span className="text-xs text-muted-foreground">
            Limitado a los {derechosCount} derecho{derechosCount === 1 ? "" : "s"}{" "}
            contratado{derechosCount === 1 ? "" : "s"} de {marca.nombre}
            {objetivos.length > 0 && (
              <> · priorizado por objetivos: {objetivos.join(", ")}</>
            )}{" "}
            ·{" "}
            <Link href="/contexto/derechos" className="underline">
              derechos
            </Link>{" "}
            ·{" "}
            <Link href="/contexto/objetivos" className="underline">
              objetivos
            </Link>
          </span>
        )}
      </div>

      {oportunidades.length === 0 ? (
        <section className="rounded-lg border border-dashed border-border p-8 text-center">
          <h2 className="text-sm font-medium">
            {marca ? "Sin oportunidades para los derechos contratados" : "Aún no hay oportunidades"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {marca ? (
              <>
                Los derechos contratados de {marca.nombre} no habilitan activaciones
                sobre las señales actuales. Añade derechos digitales/sociales en{" "}
                <Link href="/contexto/derechos" className="underline">
                  gestionar derechos
                </Link>
                .
              </>
            ) : (
              <>
                No hay señales públicas suficientes para este club todavía. Ejecuta la
                ingesta de datos públicos y vuelve a abrir el mapa.
              </>
            )}
          </p>
        </section>
      ) : (
        <OportunidadesLista oportunidades={oportunidades} />
      )}
    </main>
  );
}
