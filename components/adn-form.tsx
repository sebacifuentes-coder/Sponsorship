"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { AdnMarca, BorradorAdn, OrigenAdn } from "@/core/context";
import type { MarcaSemilla } from "@/lib/context/marcas-semilla";

interface CamposEditables {
  valores: string;
  tonoVoz: string;
  identidadVisual: string;
  posicionamiento: string;
}

const VACIO: CamposEditables = {
  valores: "",
  tonoVoz: "",
  identidadVisual: "",
  posicionamiento: "",
};

function desdeAdn(adn: AdnMarca): CamposEditables {
  return {
    valores: adn.valores.join(", "),
    tonoVoz: adn.tonoVoz,
    identidadVisual: adn.identidadVisual,
    posicionamiento: adn.posicionamiento,
  };
}

function desdeBorrador(b: BorradorAdn): CamposEditables {
  return {
    valores: b.valores.join(", "),
    tonoVoz: b.tonoVoz,
    identidadVisual: b.identidadVisual,
    posicionamiento: b.posicionamiento,
  };
}

function parseValores(texto: string): string[] {
  return texto
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
    .slice(0, 8);
}

export function AdnForm({ marcas }: { marcas: MarcaSemilla[] }) {
  const [marcaId, setMarcaId] = useState(marcas[0]?.marcaId ?? "");
  const [sector, setSector] = useState("");
  const [campos, setCampos] = useState<CamposEditables>(VACIO);
  const [origen, setOrigen] = useState<OrigenAdn>("editado-usuario");
  const [cargando, setCargando] = useState(true);
  const [sugiriendo, setSugiriendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [notaBorrador, setNotaBorrador] = useState<string | null>(null);

  const marca = marcas.find((m) => m.marcaId === marcaId);

  // Carga el ADN vigente de la marca seleccionada.
  useEffect(() => {
    let cancelado = false;
    async function cargar() {
      setCargando(true);
      setAviso(null);
      setNotaBorrador(null);
      try {
        const resp = await fetch(`/api/context/adn?marca=${marcaId}`);
        if (!resp.ok) throw new Error();
        const data: { adn: AdnMarca | null } = await resp.json();
        if (cancelado) return;
        if (data.adn) {
          setCampos(desdeAdn(data.adn));
          setOrigen(data.adn.origen);
        } else {
          setCampos(VACIO);
          setOrigen("editado-usuario");
        }
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

  async function proponerBorrador() {
    if (!marca) return;
    setSugiriendo(true);
    setAviso(null);
    try {
      const resp = await fetch("/api/context/adn/sugerir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marcaId: marca.marcaId,
          propiedadId: marca.propiedadId,
          nombre: marca.nombre,
          sector: sector.trim() || undefined,
        }),
      });
      if (!resp.ok) throw new Error("No se pudo proponer el borrador.");
      const data: { borrador: BorradorAdn } = await resp.json();
      setCampos(desdeBorrador(data.borrador));
      setOrigen("borrador-ia");
      setNotaBorrador(data.borrador.nota);
    } catch (e) {
      setAviso(e instanceof Error ? e.message : "Error al proponer.");
    } finally {
      setSugiriendo(false);
    }
  }

  async function guardar() {
    if (!marca) return;
    setGuardando(true);
    setAviso(null);
    try {
      const resp = await fetch("/api/context/adn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marcaId: marca.marcaId,
          propiedadId: marca.propiedadId,
          valores: parseValores(campos.valores),
          tonoVoz: campos.tonoVoz.trim(),
          identidadVisual: campos.identidadVisual.trim(),
          posicionamiento: campos.posicionamiento.trim(),
          // Si la persona editó tras el borrador, el origen pasa a usuario al guardar.
          origen,
        }),
      });
      if (!resp.ok) throw new Error("No se pudo guardar el ADN.");
      setAviso("ADN de marca guardado. Disponible para la generación (Épica 3).");
    } catch (e) {
      setAviso(e instanceof Error ? e.message : "Error al guardar.");
    } finally {
      setGuardando(false);
    }
  }

  function editar<K extends keyof CamposEditables>(campo: K, valor: string) {
    setCampos((c) => ({ ...c, [campo]: valor }));
    // Cualquier edición manual marca el ADN como editado por la persona.
    setOrigen("editado-usuario");
  }

  const deshabilitado = cargando || sugiriendo || guardando;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
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
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Sector (opcional, afina el borrador)</span>
          <input
            type="text"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder="ecommerce · delivery · consumo · fintech…"
            className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={proponerBorrador} disabled={deshabilitado}>
          {sugiriendo ? "Proponiendo…" : "Proponer borrador con IA"}
        </Button>
        <span className="text-xs text-muted-foreground">
          Origen del ADN actual:{" "}
          <span className="font-mono text-foreground">{origen}</span>
        </span>
      </div>

      {notaBorrador && (
        <p className="rounded-md border border-foreground/30 bg-accent/40 p-3 text-xs text-muted-foreground">
          {notaBorrador}
        </p>
      )}

      <fieldset className="flex flex-col gap-4" disabled={deshabilitado}>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">
            Valores (separados por comas)
          </span>
          <input
            type="text"
            value={campos.valores}
            onChange={(e) => editar("valores", e.target.value)}
            placeholder="p. ej. Cercanía, Inmediatez, Confianza"
            className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Tono de voz</span>
          <textarea
            value={campos.tonoVoz}
            onChange={(e) => editar("tonoVoz", e.target.value)}
            rows={2}
            className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Identidad visual</span>
          <textarea
            value={campos.identidadVisual}
            onChange={(e) => editar("identidadVisual", e.target.value)}
            rows={2}
            className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Posicionamiento</span>
          <textarea
            value={campos.posicionamiento}
            onChange={(e) => editar("posicionamiento", e.target.value)}
            rows={2}
            className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
        </label>
      </fieldset>

      <div className="flex items-center gap-3">
        <Button onClick={guardar} disabled={deshabilitado}>
          {guardando ? "Guardando…" : "Guardar ADN"}
        </Button>
        {aviso && <span className="text-sm text-muted-foreground">{aviso}</span>}
      </div>
    </div>
  );
}
