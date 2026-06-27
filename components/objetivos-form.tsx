"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  ETIQUETA_OBJETIVO,
  OBJETIVOS_COMUNICACION,
  metricasFavorecidas,
  type ObjetivoComunicacion,
} from "@/core/context";
import type { MarcaSemilla } from "@/lib/context/marcas-semilla";

export function ObjetivosForm({ marcas }: { marcas: MarcaSemilla[] }) {
  const [marcaId, setMarcaId] = useState(marcas[0]?.marcaId ?? "");
  const [seleccion, setSeleccion] = useState<Set<ObjetivoComunicacion>>(new Set());
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const marca = marcas.find((m) => m.marcaId === marcaId);

  useEffect(() => {
    let cancelado = false;
    async function cargar() {
      setCargando(true);
      setAviso(null);
      try {
        const resp = await fetch(`/api/context/objetivos?marca=${marcaId}`);
        if (!resp.ok) throw new Error();
        const data: { objetivos: ObjetivoComunicacion[] } = await resp.json();
        if (!cancelado) setSeleccion(new Set(data.objetivos));
      } catch {
        if (!cancelado) setSeleccion(new Set());
      } finally {
        if (!cancelado) setCargando(false);
      }
    }
    void cargar();
    return () => {
      cancelado = true;
    };
  }, [marcaId]);

  const metricas = useMemo(
    () => Array.from(metricasFavorecidas(Array.from(seleccion))),
    [seleccion],
  );

  function alternar(o: ObjetivoComunicacion) {
    setSeleccion((s) => {
      const copia = new Set(s);
      if (copia.has(o)) copia.delete(o);
      else copia.add(o);
      return copia;
    });
    setAviso(null);
  }

  async function guardar() {
    if (!marca) return;
    setGuardando(true);
    setAviso(null);
    try {
      const resp = await fetch("/api/context/objetivos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marcaId: marca.marcaId,
          propiedadId: marca.propiedadId,
          objetivos: Array.from(seleccion),
        }),
      });
      if (!resp.ok) throw new Error("No se pudieron guardar los objetivos.");
      setAviso("Objetivos guardados como contexto vigente.");
    } catch (e) {
      setAviso(e instanceof Error ? e.message : "Error al guardar.");
    } finally {
      setGuardando(false);
    }
  }

  const deshabilitado = cargando || guardando;

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted-foreground">Marca patrocinadora</span>
        <select
          value={marcaId}
          onChange={(e) => setMarcaId(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
        >
          {marcas.map((m) => (
            <option key={m.marcaId} value={m.marcaId}>
              {m.nombre}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="grid gap-2 sm:grid-cols-2" disabled={deshabilitado}>
        <legend className="mb-1 text-sm font-medium">
          Objetivos de comunicación vigentes
        </legend>
        {OBJETIVOS_COMUNICACION.map((o) => (
          <label
            key={o}
            className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${
              seleccion.has(o) ? "border-foreground" : "border-border"
            }`}
          >
            <input type="checkbox" checked={seleccion.has(o)} onChange={() => alternar(o)} />
            {ETIQUETA_OBJETIVO[o]}
          </label>
        ))}
      </fieldset>

      <div className="rounded-lg border border-border p-4 text-sm">
        <h2 className="font-medium">Efecto en la priorización</h2>
        {metricas.length === 0 ? (
          <p className="mt-1 text-muted-foreground">
            Sin objetivos, la priorización es la base (Historia 1.4): valor potencial
            por categoría, alcance e intensidad de señal.
          </p>
        ) : (
          <p className="mt-1 text-muted-foreground">
            Las oportunidades con métrica{" "}
            <span className="font-mono text-foreground">{metricas.join(", ")}</span>{" "}
            reciben un boost y suben en el{" "}
            {marca ? (
              <Link href={`/oportunidades?marca=${marca.marcaId}`} className="underline">
                mapa de esta marca
              </Link>
            ) : (
              "mapa de oportunidades"
            )}
            .
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={guardar} disabled={deshabilitado}>
          {guardando ? "Guardando…" : "Guardar objetivos"}
        </Button>
        {aviso && <span className="text-sm text-muted-foreground">{aviso}</span>}
      </div>
    </div>
  );
}
