/**
 * API del Contexto adicional de la Marca (FR-18, Historia 2.4).
 *
 *   GET  /api/context/adicional?marca=<id>  — contexto adicional (o null).
 *   POST /api/context/adicional             — guarda (upsert) el contexto.
 *
 * Plano ligero (AD-1). Mutación de dominio en `core/context` (AD-7). Todos los
 * campos opcionales: captura progresiva, no bloquea el primer valor.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { repositorioContextoAdicional } from '@/lib/context/contexto-adicional-service';
import { contextoAdicionalEntradaSchema } from '@/core/context';

export async function GET(request: NextRequest) {
  const marcaId = request.nextUrl.searchParams.get('marca');
  const parsed = z.string().uuid().safeParse(marcaId);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDACION', message: 'Parámetro "marca" inválido o ausente.' } },
      { status: 400 },
    );
  }

  const repo = await repositorioContextoAdicional();
  const contexto = await repo.obtenerContexto(parsed.data);
  return NextResponse.json({ contexto }, { status: 200 });
}

const cuerpoSchema = z
  .object({
    marcaId: z.string().uuid(),
    propiedadId: z.string().uuid(),
  })
  .and(contextoAdicionalEntradaSchema);

export async function POST(request: NextRequest) {
  const cuerpo = await request.json().catch(() => null);
  const parsed = cuerpoSchema.safeParse(cuerpo);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDACION', message: 'Datos de contexto adicional inválidos.' } },
      { status: 400 },
    );
  }

  const { marcaId, propiedadId, ...entrada } = parsed.data;
  const repo = await repositorioContextoAdicional();
  const contexto = await repo.guardarContexto(marcaId, propiedadId, entrada);
  return NextResponse.json({ contexto }, { status: 200 });
}
