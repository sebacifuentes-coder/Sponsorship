/**
 * POST /api/ttfv — registra un evento de Tiempo al Primer Valor (Historia 1.5).
 * Instrumenta la métrica TTFV (invariante de producto). No bloquea el primer
 * valor: si el registro falla, responde 200 con `persistido: false` (AD-1).
 */

import { NextResponse, type NextRequest } from 'next/server';
import { eventoTtfvSchema, registrarTtfv } from '@/lib/observability/ttfv';

export async function POST(request: NextRequest) {
  const cuerpo = await request.json().catch(() => null);
  const parsed = eventoTtfvSchema.safeParse(cuerpo);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDACION', message: 'Evento TTFV inválido.' } },
      { status: 400 },
    );
  }

  const resultado = await registrarTtfv(parsed.data);
  return NextResponse.json(resultado, { status: 200 });
}
