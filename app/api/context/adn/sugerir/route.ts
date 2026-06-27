/**
 * POST /api/context/adn/sugerir — propone un borrador de ADN (FR-16, Historia 2.2).
 *
 * Pre-relleno asistido por IA: el borrador entra por el `BrandDnaPort` (AD-5).
 * Hoy lo provee el adaptador semilla determinista; en la Épica 3 lo provee el
 * adaptador de LLM, sin tocar esta ruta ni el núcleo. No persiste: la persona
 * edita y guarda luego vía POST /api/context/adn.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { brandDnaPort } from '@/lib/context/adn-marca-service';

const cuerpoSchema = z.object({
  marcaId: z.string().uuid(),
  propiedadId: z.string().uuid(),
  nombre: z.string().min(1).max(120),
  sector: z.string().max(60).optional(),
});

export async function POST(request: NextRequest) {
  const cuerpo = await request.json().catch(() => null);
  const parsed = cuerpoSchema.safeParse(cuerpo);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDACION', message: 'Datos para sugerir ADN inválidos.' } },
      { status: 400 },
    );
  }

  const { marcaId, propiedadId, nombre, sector } = parsed.data;
  const borrador = await brandDnaPort().sugerirBorrador({ marcaId, propiedadId, nombre, sector });
  return NextResponse.json({ borrador }, { status: 200 });
}
