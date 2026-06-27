/**
 * API del ADN de marca (FR-16, Historia 2.2).
 *
 *   GET  /api/context/adn?marca=<id>  — devuelve el ADN vigente (o null).
 *   POST /api/context/adn             — guarda (upsert) el ADN de la Marca.
 *
 * Plano ligero (AD-1). La mutación de dominio ocurre en `core/context` vía el
 * repositorio (AD-7); aquí solo se valida la frontera y se inyecta el proveedor.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { repositorioAdn } from '@/lib/context/adn-marca-service';
import { adnEntradaSchema } from '@/core/context';

export async function GET(request: NextRequest) {
  const marcaId = request.nextUrl.searchParams.get('marca');
  const parsed = z.string().uuid().safeParse(marcaId);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDACION', message: 'Parámetro "marca" inválido o ausente.' } },
      { status: 400 },
    );
  }

  const repo = await repositorioAdn();
  const adn = await repo.obtenerAdn(parsed.data);
  return NextResponse.json({ adn }, { status: 200 });
}

const cuerpoSchema = z
  .object({
    marcaId: z.string().uuid(),
    propiedadId: z.string().uuid(),
  })
  .and(adnEntradaSchema);

export async function POST(request: NextRequest) {
  const cuerpo = await request.json().catch(() => null);
  const parsed = cuerpoSchema.safeParse(cuerpo);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDACION', message: 'Datos de ADN inválidos.' } },
      { status: 400 },
    );
  }

  const { marcaId, propiedadId, ...entrada } = parsed.data;
  const repo = await repositorioAdn();
  const adn = await repo.guardarAdn(marcaId, propiedadId, entrada);
  return NextResponse.json({ adn }, { status: 200 });
}
