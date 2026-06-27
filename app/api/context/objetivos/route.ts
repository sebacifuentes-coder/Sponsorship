/**
 * API de Objetivos de comunicación (FR-17, Historia 2.3).
 *
 *   GET  /api/context/objetivos?marca=<id>  — objetivos vigentes (lista).
 *   POST /api/context/objetivos             — guarda (upsert) los objetivos.
 *
 * Plano ligero (AD-1). Mutación de dominio en `core/context` (AD-7).
 */

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { repositorioObjetivos } from '@/lib/context/objetivos-service';
import { OBJETIVOS_COMUNICACION } from '@/core/context';

export async function GET(request: NextRequest) {
  const marcaId = request.nextUrl.searchParams.get('marca');
  const parsed = z.string().uuid().safeParse(marcaId);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDACION', message: 'Parámetro "marca" inválido o ausente.' } },
      { status: 400 },
    );
  }

  const repo = await repositorioObjetivos();
  const registro = await repo.obtenerObjetivos(parsed.data);
  return NextResponse.json({ objetivos: registro?.objetivos ?? [] }, { status: 200 });
}

const cuerpoSchema = z.object({
  marcaId: z.string().uuid(),
  propiedadId: z.string().uuid(),
  objetivos: z
    .array(z.enum(OBJETIVOS_COMUNICACION))
    .max(OBJETIVOS_COMUNICACION.length)
    .refine((os) => new Set(os).size === os.length, {
      message: 'No se permiten objetivos duplicados.',
    }),
});

export async function POST(request: NextRequest) {
  const cuerpo = await request.json().catch(() => null);
  const parsed = cuerpoSchema.safeParse(cuerpo);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDACION', message: 'Datos de objetivos inválidos.' } },
      { status: 400 },
    );
  }

  const { marcaId, propiedadId, objetivos } = parsed.data;
  const repo = await repositorioObjetivos();
  const registro = await repo.guardarObjetivos(marcaId, propiedadId, objetivos);
  return NextResponse.json({ objetivos: registro.objetivos }, { status: 200 });
}
