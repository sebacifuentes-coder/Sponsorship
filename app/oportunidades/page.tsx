import Link from "next/link";

import { leerSenalesPublicas, DEMO_PROPIEDAD_ID } from "@/lib/intelligence/leer-senales";
import { generarOportunidades, priorizarOportunidades } from "@/core/opportunities";
import { OportunidadesLista } from "@/components/oportunidades-lista";

export const metadata = {
  title: "Mapa de oportunidades · Copiloto de Patrocinio",
};

export default async function OportunidadesPage() {
  const senales = await leerSenalesPublicas(DEMO_PROPIEDAD_ID);
  const oportunidades = priorizarOportunidades(generarOportunidades(senales), senales);

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

      {oportunidades.length === 0 ? (
        <section className="rounded-lg border border-dashed border-border p-8 text-center">
          <h2 className="text-sm font-medium">Aún no hay oportunidades</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            No hay señales públicas suficientes para este club todavía. Ejecuta la
            ingesta de datos públicos y vuelve a abrir el mapa.
          </p>
        </section>
      ) : (
        <OportunidadesLista oportunidades={oportunidades} />
      )}
    </main>
  );
}
