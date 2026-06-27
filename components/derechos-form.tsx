"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  ETIQUETA_DERECHO,
  TIPOS_DERECHO,
  limitarPorTipos,
  type DerechoContratado,
  type TipoDerecho,
} from "@/core/context";
import type { OportunidadPriorizada } from "@/core/opportunities";
import type { MarcaSemilla } from "@/lib/context/marcas-semilla";

interface EstadoDerecho {
  marcado: boolean;
  descripcion: string;
}

type Catalogo = Record<TipoDerecho, EstadoDerecho>;

function catalogoVacio(): Catalogo {
  return Object.fromEntries(
    TIPOS_DERECHO.map((t) => [t, { marcado: false, descripcion: "" }]),
  ) as Catalogo;
}

function catalogoDesde(derechos: DerechoContratado[]): Catalogo {
  const base = catalogoVacio();
  for (const d of derechos) {
    base[d.tipo] = { marcado: d.activo, descripcion: d.descripcion ?? "" };
  }
  return base;
}

export function DerechosForm({
  marcas,
  oportunidades,
}: {
  marcas: MarcaSemilla[];
  oportunidades: OportunidadPriorizada[];
}) {
  const [marcaId, setMarcaId] = useState(marcas[0]?.marcaId ?? "");
  const [catalogo, setCatalogo] = useState<Catalogo>(catalogoVacio());
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const marca = marcas.find((m) => m.marcaId === marcaId);

  // Carga el catálogo de la marca seleccionada.
  useEffect(() => {
    let cancelado = false;
    async function cargar() {
      setCargando(true);
      setAviso(null);
      try {
        const resp = await fetch(`/api/context/derechos?marca=${marcaId}`);
        if (!resp.ok) throw new Error();
        const data: { derechos: DerechoContratado[] } = await resp.json();
        if (!cancelado) setCatalogo(catalogoDesde(data.derechos));
      } catch {
        if (!cancelado) setCatalogo(catalogoVacio());
      } finally {
        if (!cancelado) setCargando(false);
      }
    }
    void cargar();
    return () => {
      cancelado = true;
    };
  }, [marcaId]);

  // Tipos activos → filtro en vivo de oportunidades (mismo núcleo que el borde).
  const tiposActivos = useMemo(
    () =>
      new Set(
        TIPOS_DERECHO.filter((t) => catalogo[t].marcado),
      ) as ReadonlySet<TipoDerecho>,
    [catalogo],
  );

  const visibles = useMemo(
    () => limitarPorTipos(oportunidades, tiposActivos),
    [oportunidades, tiposActivos],
  );

  function alternar(tipo: TipoDerecho) {
    setCatalogo((c) => ({ ...c, [tipo]: { ...c[tipo], marcado: !c[tipo].marcado } }));
    setAviso(null);
  }

  function editarDescripcion(tipo: TipoDerecho, descripcion: string) {
    setCatalogo((c) => ({ ...c, [tipo]: { ...c[tipo], descripcion } }));
  }

  async function guardar() {
    if (!marca) return;
    setGuardando(true);
    setAviso(null);
    try {
      const derechos = TIPOS_DERECHO.filter((t) => catalogo[t].marcado).map((t) => ({
        tipo: t,
        descripcion: catalogo[t].descripcion.trim() || undefined,
        activo: true,
      }));
      const resp = await fetch("/api/context/derechos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marcaId: marca.marcaId,
          propiedadId: marca.propiedadId,
          derechos,
        }),
      });
      if (!resp.ok) throw new Error("No se pudo guardar el catálogo.");
      setAviso("Catálogo de derechos guardado.");
    } catch (e) {
      setAviso(e instanceof Error ? e.message : "Error al guardar.");
    } finally {
      setGuardando(false);
    }
  }

  const totalMarcados = tiposActivos.size;

  return (
    <div className="flex flex-col gap-6">
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

      <div className="grid gap-3 sm:grid-cols-[1fr_18rem]">
        <fieldset className="flex flex-col gap-2" disabled={cargando || guardando}>
          <legend className="mb-1 text-sm font-medium">
            Derechos contratados {cargando && <span className="text-muted-foreground">· cargando…</span>}
          </legend>
          {TIPOS_DERECHO.map((tipo) => (
            <div
              key={tipo}
              className={`flex flex-col gap-2 rounded-md border p-3 ${
                catalogo[tipo].marcado ? "border-foreground" : "border-border"
              }`}
            >
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={catalogo[tipo].marcado}
                  onChange={() => alternar(tipo)}
                />
                {ETIQUETA_DERECHO[tipo]}
              </label>
              {catalogo[tipo].marcado && (
                <input
                  type="text"
                  value={catalogo[tipo].descripcion}
                  onChange={(e) => editarDescripcion(tipo, e.target.value)}
                  placeholder="Detalle opcional (alcance, jornadas, formato…)"
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground"
                />
              )}
            </div>
          ))}
        </fieldset>

        {/* Preview en vivo del filtrado por derechos (AC clave de la 2.1). */}
        <aside className="flex h-fit flex-col gap-3 rounded-lg border border-border p-4 text-sm">
          <h2 className="font-medium">Oportunidades habilitadas</h2>
          <p className="text-muted-foreground">
            Con {totalMarcados} derecho{totalMarcados === 1 ? "" : "s"} contratado
            {totalMarcados === 1 ? "" : "s"}, se proponen{" "}
            <span className="font-mono text-foreground">{visibles.length}</span> de{" "}
            {oportunidades.length} oportunidades.
          </p>
          {totalMarcados === 0 && (
            <p className="text-xs text-muted-foreground">
              Sin derechos registrados, el sistema no limita la oferta (captura
              progresiva, no bloquea el primer valor). La personalización es básica.
            </p>
          )}
          {totalMarcados > 0 && visibles.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Los derechos contratados de esta marca no habilitan ninguna activación
              sobre las señales públicas actuales. Añade derechos digitales/sociales
              para habilitarlas.
            </p>
          )}
          <ul className="flex flex-col gap-2">
            {visibles.map((o) => (
              <li key={o.id} className="rounded-md border border-border px-3 py-2 text-xs">
                <span className="font-medium">{o.titulo}</span>
                <span className="ml-1 font-mono text-muted-foreground">
                  {o.valorPotencial.estimado}/100
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={guardar} disabled={guardando || cargando}>
          {guardando ? "Guardando…" : "Guardar catálogo"}
        </Button>
        {aviso && <span className="text-sm text-muted-foreground">{aviso}</span>}
      </div>
    </div>
  );
}
