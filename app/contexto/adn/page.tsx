import Link from "next/link";

import { MARCAS_SEMILLA } from "@/lib/context/marcas-semilla";
import { DEMO_PROPIEDAD_ID } from "@/lib/intelligence/clubes-semilla";
import { AdnForm } from "@/components/adn-form";

export const metadata = {
  title: "ADN de marca · Copiloto de Patrocinio",
};

export default function AdnPage() {
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
          ADN de marca
        </h1>
        <p className="text-sm text-muted-foreground">
          Captura valores, tono de voz, identidad visual y posicionamiento de la
          Marca (FR-16). Propón un borrador asistido por IA desde su presencia
          pública, edítalo y guárdalo. Quedará disponible para la generación
          creativa (Épica 3). Captura progresiva: no bloquea el primer valor.
        </p>
      </header>

      <AdnForm marcas={marcas} />
    </main>
  );
}
