import Link from "next/link";

import { leerSenalesPublicas, DEMO_PROPIEDAD_ID } from "@/lib/intelligence/leer-senales";
import { generarOportunidades } from "@/core/opportunities";
import type { CategoriaSenal } from "@/core/intelligence/senal";

export const metadata = {
  title: "Mapa de oportunidades · Copiloto de Patrocinio",
};

const ETIQUETA_CATEGORIA: Record<CategoriaSenal, string> = {
  busqueda_intencion: "Intención",
  consumo_canal: "Canal",
  opinion_sentimiento: "Sentimiento",
  narrativa_social: "Narrativa",
  sociodemografia: "Sociodemografía",
};

export default async function OportunidadesPage() {
  const senales = await leerSenalesPublicas(DEMO_PROPIEDAD_ID);
  const oportunidades = generarOportunidades(senales);

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
          hincha (sin PII). La precisión se elevará con datos first-party.
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
        <ul className="flex flex-col gap-4">
          {oportunidades.map((o) => (
            <li
              key={o.id}
              className="flex flex-col gap-3 rounded-lg border border-border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-medium">{o.titulo}</h2>
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {ETIQUETA_CATEGORIA[o.categoriaSenal]}
                </span>
              </div>

              <dl className="grid gap-2 text-sm sm:grid-cols-[10rem_1fr]">
                <dt className="text-muted-foreground">Segmento objetivo</dt>
                <dd>{o.segmentoObjetivo}</dd>

                <dt className="text-muted-foreground">Señal de origen</dt>
                <dd>{o.senalOrigenEtiqueta}</dd>

                <dt className="text-muted-foreground">Hipótesis de valor</dt>
                <dd>{o.hipotesisValor}</dd>

                <dt className="text-muted-foreground">Métrica de negocio</dt>
                <dd className="font-mono text-xs uppercase tracking-wide">
                  {o.metricaNegocio}
                </dd>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
