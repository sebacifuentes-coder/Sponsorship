"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ContextoAdicional } from "@/core/context";
import type { MarcaSemilla } from "@/lib/context/marcas-semilla";

interface Campos {
  audienciaObjetivo: string;
  calendario: string;
  productosMensajes: string;
  restriccionesMarca: string;
  mercados: string;
}

const VACIO: Campos = {
  audienciaObjetivo: "",
  calendario: "",
  productosMensajes: "",
  restriccionesMarca: "",
  mercados: "",
};

const ETIQUETAS: { campo: keyof Campos; etiqueta: string; ayuda: string }[] = [
  { campo: "audienciaObjetivo", etiqueta: "Audiencia objetivo", ayuda: "A quién quiere llegar la marca" },
  { campo: "calendario", etiqueta: "Calendario", ayuda: "Fechas clave, campañas, lanzamientos" },
  { campo: "productosMensajes", etiqueta: "Productos / mensajes", ayuda: "Qué impulsar" },
  { campo: "restriccionesMarca", etiqueta: "Restricciones de marca", ayuda: "Qué evitar" },
  { campo: "mercados", etiqueta: "Mercados", ayuda: "Geografías objetivo" },
];

function desde(ctx: ContextoAdicional): Campos {
  return {
    audienciaObjetivo: ctx.audienciaObjetivo,
    calendario: ctx.calendario,
    productosMensajes: ctx.productosMensajes,
    restriccionesMarca: ctx.restriccionesMarca,
    mercados: ctx.mercados,
  };
}

export function ContextoAdicionalForm({ marcas }: { marcas: MarcaSemilla[] }) {
  const [marcaId, setMarcaId] = useState(marcas[0]?.marcaId ?? "");
  const [campos, setCampos] = useState<Campos>(VACIO);
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
        const resp = await fetch(`/api/context/adicional?marca=${marcaId}`);
        if (!resp.ok) throw new Error();
        const data: { contexto: ContextoAdicional | null } = await resp.json();
        if (!cancelado) setCampos(data.contexto ? desde(data.contexto) : VACIO);
      } catch {
        if (!cancelado) setCampos(VACIO);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }
    void cargar();
    return () => {
      cancelado = true;
    };
  }, [marcaId]);

  async function guardar() {
    if (!marca) return;
    setGuardando(true);
    setAviso(null);
    try {
      const resp = await fetch("/api/context/adicional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marcaId: marca.marcaId,
          propiedadId: marca.propiedadId,
          ...campos,
        }),
      });
      if (!resp.ok) throw new Error("No se pudo guardar el contexto.");
      setAviso("Contexto adicional guardado. Referenciable por oportunidades y generación.");
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

      <fieldset className="flex flex-col gap-4" disabled={deshabilitado}>
        <legend className="mb-1 text-sm font-medium">
          Contexto adicional{" "}
          <span className="font-normal text-muted-foreground">· todos los campos opcionales</span>
        </legend>
        {ETIQUETAS.map(({ campo, etiqueta, ayuda }) => (
          <label key={campo} className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">
              {etiqueta} <span className="text-xs">· {ayuda}</span>
            </span>
            <textarea
              value={campos[campo]}
              onChange={(e) => setCampos((c) => ({ ...c, [campo]: e.target.value }))}
              rows={2}
              className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
            />
          </label>
        ))}
      </fieldset>

      <div className="flex items-center gap-3">
        <Button onClick={guardar} disabled={deshabilitado}>
          {guardando ? "Guardando…" : "Guardar contexto"}
        </Button>
        {aviso && <span className="text-sm text-muted-foreground">{aviso}</span>}
      </div>
    </div>
  );
}
