import Link from "next/link";

import { MARCAS_SEMILLA } from "@/lib/context/marcas-semilla";
import { DEMO_PROPIEDAD_ID } from "@/lib/intelligence/clubes-semilla";
import { ContextoAdicionalForm } from "@/components/contexto-adicional-form";

export const metadata = {
  title: "Contexto adicional · Copiloto de Patrocinio",
};

export default function ContextoAdicionalPage() {
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
          Contexto adicional
        </h1>
        <p className="text-sm text-muted-foreground">
          Registra audiencia objetivo, calendario, productos/mensajes, restricciones
          de marca y mercados (FR-18). Queda referenciable por oportunidades y
          generación. Captura progresiva: todos los campos son opcionales y no
          bloquean el primer valor.
        </p>
      </header>

      <ContextoAdicionalForm marcas={marcas} />
    </main>
  );
}
