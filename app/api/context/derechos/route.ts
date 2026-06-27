/**
 * API de Derechos contratados (FR-15, Historia 2.1).
 *
 *   GET  /api/context/derechos?marca=<id>  — lista el catálogo de la Marca.
 *   POST /api/context/derechos             — reemplaza el catálogo de la Marca.
 *
 * Plano ligero (AD-1). La mutación de dominio ocurre en `core/context` vía el
 * repositorio (AD-7); aquí solo se valida la frontera y se inyecta el proveedor.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { repositorioDerechos } from '@/lib/context/leer-derechos';
import { derechoEntradaSchema } from '@/core/context';

export async function GET(request: NextRequest) {
  const marcaId = request.nextUrl.searchParams.get('marca');
  const parsed = z.string().uuid().safeParse(marcaId);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDACION', message: 'Parámetro "marca" inválido o ausente.' } },
      { status: 400 },
    );
  }

  const repo = await repositorioDerechos();
  const derechos = await repo.listarDerechos(parsed.data);
  return NextResponse.json({ derechos }, { status: 200 });
}

const cuerpoSchema = z.object({
  marcaId: z.string().uuid(),
  propiedadId: z.string().uuid(),
  // Catálogo completo: no se permiten tipos duplicados.
  derechos: z
    .array(derechoEntradaSchema)
    .max(50)
    .refine(
      (ds) => new Set(ds.map((d) => d.tipo)).size === ds.length,
      { message: 'No se permiten derechos duplicados en el catálogo.' },
    ),
});

export async function POST(request: NextRequest) {
  const cuerpo = await request.json().catch(() => null);
  const parsed = cuerpoSchema.safeParse(cuerpo);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDACION', message: 'Datos de derechos inválidos.' } },
      { status: 400 },
    );
  }

  const { marcaId, propiedadId, derechos } = parsed.data;
  const repo = await repositorioDerechos();
  const guardados = await repo.reemplazarDerechos(marcaId, propiedadId, derechos);
  return NextResponse.json({ derechos: guardados }, { status: 200 });
}
