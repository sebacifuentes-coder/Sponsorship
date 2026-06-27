import Link from "next/link";

import { leerSenalesPublicas, DEMO_PROPIEDAD_ID } from "@/lib/intelligence/leer-senales";
import { generarOportunidades, priorizarOportunidades } from "@/core/opportunities";
import {
  personalizarOportunidades,
  resumenPersonalizacion,
  type ContextoMarca,
} from "@/core/context";
import { concebirConcepto } from "@/core/activations";
import { leerContextoMarca } from "@/lib/context/leer-contexto-marca";
import { MARCAS_SEMILLA, marcaSemillaPorId } from "@/lib/context/marcas-semilla";
import { OportunidadesLista } from "@/components/oportunidades-lista";
import { MarcaSelector } from "@/components/marca-selector";

export const metadata = {
  title: "Mapa de oportunidades · Copiloto de Patrocinio",
};

/** Extrae el contexto de generación (ADN + contexto adicional) para el concepto. */
function contextoConcepto(ctx: ContextoMarca) {
  return {
    tonoVoz: ctx.adn?.tonoVoz,
    valores: ctx.adn?.valores,
    audienciaObjetivo: ctx.contextoAdicional?.audienciaObjetivo,
    restriccionesMarca: ctx.contextoAdicional?.restriccionesMarca,
  };
}

export default async function OportunidadesPage({
  searchParams,
}: {
  searchParams: Promise<{ marca?: string }>;
}) {
  const { marca: marcaId } = await searchParams;
  const marca = marcaId ? marcaSemillaPorId(marcaId) : undefined;

  const senales = await leerSenalesPublicas(DEMO_PROPIEDAD_ID);
  const generadas = generarOportunidades(senales);

  // Sin marca → mapa público base (Historia 1.4). Con marca → personalizado por
  // su contexto: objetivos afinan la priorización (FR-17) y derechos la limitan
  // (FR-15); el concepto referencia ADN y contexto adicional (FR-16/FR-18).
  let oportunidades = priorizarOportunidades(generadas, senales);
  let resumen: ReturnType<typeof resumenPersonalizacion> | null = null;
  let concepto: ReturnType<typeof concebirConcepto> | null = null;

  if (marca) {
    const ctx = await leerContextoMarca(marca.marcaId);
    resumen = resumenPersonalizacion(ctx);
    oportunidades = personalizarOportunidades(generadas, senales, ctx);
    if (oportunidades.length > 0) {
      concepto = concebirConcepto(
        oportunidades[0],
        { marca: marca.nombre, objetivo: ctx.objetivos[0] ?? "awareness" },
        contextoConcepto(ctx),
      );
    }
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

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <MarcaSelector marcas={marcasPropiedad} marcaSeleccionada={marcaId ?? null} />
          {resumen && (
            <span
              className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                resumen.nivel === "personalizada"
                  ? "border-foreground text-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              personalización {resumen.nivel}
            </span>
          )}
        </div>

        {marca && resumen && (
          <p className="text-xs text-muted-foreground">
            {resumen.nivel === "personalizada" ? (
              <>Referencia el contexto de {marca.nombre}: {resumen.referencias.join(" · ")}.</>
            ) : (
              <>
                {marca.nombre} no tiene contexto registrado: el sistema usa valores
                públicos por defecto (personalización básica). Regístralo en{" "}
                <Link href="/contexto/derechos" className="underline">derechos</Link>,{" "}
                <Link href="/contexto/adn" className="underline">ADN</Link>,{" "}
                <Link href="/contexto/objetivos" className="underline">objetivos</Link> o{" "}
                <Link href="/contexto/adicional" className="underline">contexto adicional</Link>.
              </>
            )}
          </p>
        )}
      </div>

      {marca && concepto && (
        <section className="flex flex-col gap-3 rounded-lg border border-foreground/30 bg-accent/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Concepto de activación (top oportunidad)</h2>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {concepto.personalizacion}
            </span>
          </div>
          <p className="text-sm">{concepto.anguloMensaje}</p>
          <dl className="grid gap-2 text-sm sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted-foreground">Canal sugerido</dt>
            <dd>{concepto.canalSugerido}</dd>
            <dt className="text-muted-foreground">Llamada a la acción</dt>
            <dd>{concepto.llamadaAccion}</dd>
            {concepto.referencias.length > 0 && (
              <>
                <dt className="text-muted-foreground">Referencia</dt>
                <dd>{concepto.referencias.join(", ")}</dd>
              </>
            )}
          </dl>
          <p className="text-xs text-muted-foreground">{concepto.nota}</p>
        </section>
      )}

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
