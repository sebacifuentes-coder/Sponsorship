"use client";

import { useRouter } from "next/navigation";

import type { MarcaSemilla } from "@/lib/context/marcas-semilla";

/** Selector que navega añadiendo `?marca=<id>` (o lo quita en "Sin marca"). */
export function MarcaSelector({
  marcas,
  marcaSeleccionada,
}: {
  marcas: MarcaSemilla[];
  marcaSeleccionada: string | null;
}) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      Marca
      <select
        value={marcaSeleccionada ?? ""}
        onChange={(e) => {
          const valor = e.target.value;
          router.push(valor ? `/oportunidades?marca=${valor}` : "/oportunidades");
        }}
        className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground"
      >
        <option value="">Sin marca (mapa público)</option>
        {marcas.map((m) => (
          <option key={m.marcaId} value={m.marcaId}>
            {m.nombre}
          </option>
        ))}
      </select>
    </label>
  );
}
