import Link from "next/link";

import { leerSenalesPublicas, DEMO_PROPIEDAD_ID } from "@/lib/intelligence/leer-senales";
import { generarOportunidades, priorizarOportunidades } from "@/core/opportunities";
import { MARCAS_SEMILLA } from "@/lib/context/marcas-semilla";
import { DerechosForm } from "@/components/derechos-form";

export const metadata = {
  title: "Derechos contratados · Copiloto de Patrocinio",
};

export default async function DerechosPage() {
  // Oportunidades del club demo: materia prima del preview de filtrado.
  const senales = await leerSenalesPublicas(DEMO_PROPIEDAD_ID);
  const oportunidades = priorizarOportunidades(generarOportunidades(senales), senales);

  // Marcas de la Propiedad demo (en modo real, las de la Propiedad activa).
  const marcas = MARCAS_SEMILLA.filter((m) => m.propiedadId === DEMO_PROPIEDAD_ID);

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
          Derechos contratados
        </h1>
        <p className="text-sm text-muted-foreground">
          Registra el catálogo de derechos del patrocinio por Marca (camiseta, LED,
          hospitality, contenido, datos, naming…). El motor solo propone activaciones
          sobre derechos efectivamente contratados (FR-15). Captura progresiva: no
          bloquea el primer valor.
        </p>
      </header>

      <DerechosForm marcas={marcas} oportunidades={oportunidades} />
    </main>
  );
}
