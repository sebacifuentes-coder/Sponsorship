"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  CLUBES_SEMILLA,
  OBJETIVOS_COMUNICACION,
  type ObjetivoComunicacion,
} from "@/lib/intelligence/clubes-semilla";
import type { OportunidadPriorizada } from "@/core/opportunities";
import type { ConceptoActivacion } from "@/core/activations";

interface Resultado {
  oportunidades: OportunidadPriorizada[];
  concepto: ConceptoActivacion | null;
  mensaje?: string;
}

function formatoDuracion(ms: number): string {
  const totalSeg = Math.round(ms / 1000);
  const m = Math.floor(totalSeg / 60);
  const s = totalSeg % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function OnboardingWizard() {
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [propiedadId, setPropiedadId] = useState(CLUBES_SEMILLA[0].propiedadId);
  const [marca, setMarca] = useState("");
  const [objetivo, setObjetivo] = useState<ObjetivoComunicacion>("awareness");

  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ttfvMs, setTtfvMs] = useState<number | null>(null);

  // Marca de inicio del TTFV: entrada al Paso 1 (tras el primer render).
  const inicioRef = useRef<number | null>(null);
  useEffect(() => {
    inicioRef.current = performance.now();
  }, []);

  async function verPrimerValor() {
    setPaso(3);
    setCargando(true);
    setError(null);
    try {
      const resp = await fetch("/api/onboarding/primer-valor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propiedadId, marca, objetivo }),
      });
      if (!resp.ok) throw new Error("No se pudo calcular el primer valor.");
      const data: Resultado = await resp.json();
      setResultado(data);

      const inicio = inicioRef.current ?? performance.now();
      const duracionMs = Math.round(performance.now() - inicio);
      setTtfvMs(duracionMs);

      // Instrumentar TTFV (no bloquea el primer valor).
      void fetch("/api/ttfv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propiedadId, marca, objetivo, pasos: 3, duracionMs }),
      }).catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido.");
    } finally {
      setCargando(false);
    }
  }

  function reiniciar() {
    setResultado(null);
    setTtfvMs(null);
    setError(null);
    setMarca("");
    setObjetivo("awareness");
    setPaso(1);
    inicioRef.current = performance.now();
  }

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        {[1, 2, 3].map((n) => (
          <li
            key={n}
            className={`flex items-center gap-2 ${
              paso >= n ? "text-foreground" : ""
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                paso >= n ? "border-foreground" : "border-border"
              }`}
            >
              {n}
            </span>
            {n < 3 && <span className="text-border">—</span>}
          </li>
        ))}
      </ol>

      {/* Paso 1 — Elegir club */}
      {paso === 1 && (
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-base font-medium">
              ¿Sobre qué club quieres activar el patrocinio?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Paso 1 de 3 · sin integraciones, sin cargar datos del fan.
            </p>
          </div>
          <div className="grid gap-2">
            {CLUBES_SEMILLA.map((c) => (
              <label
                key={c.propiedadId}
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${
                  propiedadId === c.propiedadId
                    ? "border-foreground"
                    : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="club"
                  value={c.propiedadId}
                  checked={propiedadId === c.propiedadId}
                  onChange={() => setPropiedadId(c.propiedadId)}
                />
                {c.nombre}
              </label>
            ))}
          </div>
          <Button className="self-start" onClick={() => setPaso(2)}>
            Siguiente
          </Button>
        </section>
      )}

      {/* Paso 2 — Marca y objetivo */}
      {paso === 2 && (
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-base font-medium">¿Qué marca y qué busca esta campaña?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Paso 2 de 3 · brief mínimo. Lo demás se enriquece después.
            </p>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Marca patrocinadora</span>
            <input
              type="text"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              placeholder="p. ej. Marca de consumo"
              className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Objetivo de comunicación</span>
            <select
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value as ObjetivoComunicacion)}
              className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
            >
              {OBJETIVOS_COMUNICACION.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setPaso(1)}>
              Atrás
            </Button>
            <Button onClick={verPrimerValor} disabled={marca.trim().length === 0}>
              Ver mi primer valor
            </Button>
          </div>
        </section>
      )}

      {/* Paso 3 — Resultado */}
      {paso === 3 && (
        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-base font-medium">Tu primer valor</h2>
            {ttfvMs !== null && (
              <p className="mt-1 text-sm text-muted-foreground">
                Paso 3 de 3 · obtenido en{" "}
                <span className="font-mono text-foreground">{formatoDuracion(ttfvMs)}</span>{" "}
                (TTFV instrumentado).
              </p>
            )}
          </div>

          {cargando && <p className="text-sm text-muted-foreground">Calculando…</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}

          {resultado?.concepto && (
            <div className="flex flex-col gap-3 rounded-lg border border-foreground/30 bg-accent/40 p-4">
              <h3 className="text-sm font-semibold">Concepto de activación</h3>
              <p className="text-sm">{resultado.concepto.anguloMensaje}</p>
              <dl className="grid gap-2 text-sm sm:grid-cols-[8rem_1fr]">
                <dt className="text-muted-foreground">Canal sugerido</dt>
                <dd>{resultado.concepto.canalSugerido}</dd>
                <dt className="text-muted-foreground">Llamada a la acción</dt>
                <dd>{resultado.concepto.llamadaAccion}</dd>
              </dl>
              <p className="text-xs text-muted-foreground">{resultado.concepto.nota}</p>
            </div>
          )}

          {resultado && resultado.oportunidades.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">
                Mapa de oportunidades (top {resultado.oportunidades.length})
              </h3>
              <ul className="flex flex-col gap-3">
                {resultado.oportunidades.map((o) => (
                  <li key={o.id} className="rounded-lg border border-border p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{o.titulo}</span>
                      <span className="font-mono tabular-nums text-muted-foreground">
                        {o.valorPotencial.estimado}/100
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{o.hipotesisValor}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resultado && resultado.oportunidades.length === 0 && !cargando && (
            <p className="text-sm text-muted-foreground">
              {resultado.mensaje ?? "Aún no hay oportunidades para este club."}
            </p>
          )}

          <Button variant="outline" className="self-start" onClick={reiniciar}>
            Empezar de nuevo
          </Button>
        </section>
      )}
    </div>
  );
}
