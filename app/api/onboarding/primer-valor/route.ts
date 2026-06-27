/**
 * POST /api/onboarding/primer-valor — calcula el primer valor (Historia 1.5).
 *
 * Plano ligero, sin integración profunda (AD-1): señales públicas → mapa de
 * oportunidades priorizado + un concepto de activación sobre la de mayor valor.
 * No exige Salesforce/Adobe ni Clean Room.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { leerSenalesPublicas } from '@/lib/intelligence/leer-senales';
import { generarOportunidades, priorizarOportunidades } from '@/core/opportunities';
import { concebirConcepto } from '@/core/activations';

const cuerpoSchema = z.object({
  propiedadId: z.string().uuid(),
  marca: z.string().min(1).max(120),
  objetivo: z.string().min(1).max(40),
});

/** Cuántas oportunidades top mostrar en el primer valor. */
const TOP_OPORTUNIDADES = 5;

export async function POST(request: NextRequest) {
  const cuerpo = await request.json().catch(() => null);
  const parsed = cuerpoSchema.safeParse(cuerpo);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDACION', message: 'Datos de onboarding inválidos.' } },
      { status: 400 },
    );
  }

  const { propiedadId, marca, objetivo } = parsed.data;

  const senales = await leerSenalesPublicas(propiedadId);
  const priorizadas = priorizarOportunidades(generarOportunidades(senales), senales);

  if (priorizadas.length === 0) {
    return NextResponse.json(
      {
        oportunidades: [],
        concepto: null,
        mensaje: 'Aún no hay señales públicas suficientes para este club.',
      },
      { status: 200 },
    );
  }

  const oportunidades = priorizadas.slice(0, TOP_OPORTUNIDADES);
  const concepto = concebirConcepto(priorizadas[0], { marca, objetivo });

  return NextResponse.json({ oportunidades, concepto }, { status: 200 });
}
