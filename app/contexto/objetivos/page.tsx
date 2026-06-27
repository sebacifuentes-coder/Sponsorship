import Link from "next/link";

import { MARCAS_SEMILLA } from "@/lib/context/marcas-semilla";
import { DEMO_PROPIEDAD_ID } from "@/lib/intelligence/clubes-semilla";
import { ObjetivosForm } from "@/components/objetivos-form";

export const metadata = {
  title: "Objetivos de comunicación · Copiloto de Patrocinio",
};

export default function ObjetivosPage() {
  const marcas = MARCAS_SEMILLA.filter((m) => m.propiedadId === DEMO_PROPIEDAD_ID);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:underline"
        >
          ← Inicio
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Objetivos de comunicación
        </h1>
        <p className="text-sm text-muted-foreground">
          Registra los objetivos de la campaña/marca (awareness, consideración,
          conversión, lanzamiento, fidelización). Se guardan como contexto vigente y
          la priorización de oportunidades (Historia 1.4) los toma en cuenta (FR-17).
        </p>
      </header>

      <ObjetivosForm marcas={marcas} />
    </main>
  );
}
