"use client";

import { useMemo, useState } from "react";

import type { OportunidadPriorizada } from "@/core/opportunities";
import type { CategoriaSenal } from "@/core/intelligence/senal";

const ETIQUETA_CATEGORIA: Record<CategoriaSenal, string> = {
  busqueda_intencion: "Intención",
  consumo_canal: "Canal",
  opinion_sentimiento: "Sentimiento",
  narrativa_social: "Narrativa",
  sociodemografia: "Sociodemografía",
};

const COLOR_CONFIANZA: Record<string, string> = {
  alta: "text-foreground",
  media: "text-muted-foreground",
  baja: "text-muted-foreground",
};

type Orden = "valor-desc" | "valor-asc" | "categoria";

export function OportunidadesLista({
  oportunidades,
}: {
  oportunidades: OportunidadPriorizada[];
}) {
  const [orden, setOrden] = useState<Orden>("valor-desc");
  const [filtro, setFiltro] = useState<CategoriaSenal | "todas">("todas");

  const categoriasPresentes = useMemo(
    () => Array.from(new Set(oportunidades.map((o) => o.categoriaSenal))),
    [oportunidades],
  );

  const visibles = useMemo(() => {
    const filtradas =
      filtro === "todas"
        ? oportunidades
        : oportunidades.filter((o) => o.categoriaSenal === filtro);

    const copia = [...filtradas];
    if (orden === "valor-desc") {
      copia.sort((a, b) => b.valorPotencial.estimado - a.valorPotencial.estimado);
    } else if (orden === "valor-asc") {
      copia.sort((a, b) => a.valorPotencial.estimado - b.valorPotencial.estimado);
    } else {
      copia.sort((a, b) => a.categoriaSenal.localeCompare(b.categoriaSenal));
    }
    return copia;
  }, [oportunidades, orden, filtro]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Ordenar
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground"
          >
            <option value="valor-desc">Valor potencial (mayor primero)</option>
            <option value="valor-asc">Valor potencial (menor primero)</option>
            <option value="categoria">Categoría</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Filtrar
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as CategoriaSenal | "todas")}
            className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground"
          >
            <option value="todas">Todas las categorías</option>
            {categoriasPresentes.map((c) => (
              <option key={c} value={c}>
                {ETIQUETA_CATEGORIA[c]}
              </option>
            ))}
          </select>
        </label>

        <span className="ml-auto text-xs text-muted-foreground">
          {visibles.length} de {oportunidades.length}
        </span>
      </div>

      <ul className="flex flex-col gap-4">
        {visibles.map((o) => (
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

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums">
                {o.valorPotencial.estimado}
              </span>
              <span className="text-xs text-muted-foreground">
                / 100 valor potencial ·{" "}
                <span className={COLOR_CONFIANZA[o.valorPotencial.confianza]}>
                  confianza {o.valorPotencial.confianza}
                </span>
              </span>
            </div>

            <dl className="grid gap-2 text-sm sm:grid-cols-[10rem_1fr]">
              <dt className="text-muted-foreground">Segmento objetivo</dt>
              <dd>{o.segmentoObjetivo}</dd>

              <dt className="text-muted-foreground">Señal de origen</dt>
              <dd>{o.senalOrigenEtiqueta}</dd>

              <dt className="text-muted-foreground">Hipótesis de valor</dt>
              <dd>{o.hipotesisValor}</dd>

              <dt className="text-muted-foreground">Método del estimado</dt>
              <dd>
                Métrica <span className="font-mono text-xs">{o.valorPotencial.metrica}</span>.{" "}
                {o.valorPotencial.supuesto}{" "}
                <span className="text-muted-foreground">
                  (método {o.valorPotencial.metodoVersion})
                </span>
              </dd>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
