/**
 * POST /api/intelligence/ingest — ejecuta la ingesta de datos públicos (Historia 1.2).
 *
 * Borde que cablea el caso de uso del núcleo con sus dependencias (AD-7):
 *   PublicDataPort (adaptador semilla) → ingestarSenalesPublicas → Almacén.
 *
 * Modos:
 *  - Supabase configurado: persiste en `senales_publicas` con RBAC + RLS (AD-9).
 *    Requiere sesión con capacidad `gestionar:datos-fan` (Consultor/Propiedad).
 *  - Sin Supabase (local/demo): usa el almacén en memoria (AD-1, corre sin creds)
 *    y devuelve las señales ingestadas para inspección.
 */

import { NextResponse, type NextRequest } from 'next/server';

import { isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { obtenerSesion } from '@/lib/auth/session';
import { puede } from '@/core/shared/roles';
import {
  ingestarSenalesPublicas,
  AlmacenInteligenciaPublicaEnMemoria,
  type AlmacenInteligenciaPublica,
} from '@/core/intelligence';
import { SeedPublicDataAdapter } from '@/adapters/publicdata/seed-public-data-adapter';
import { SupabaseAlmacenInteligenciaPublica } from '@/lib/repositories/intelligence-repository';
import { DEMO_PROPIEDAD_ID } from '@/lib/intelligence/leer-senales';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function errorJson(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: NextRequest) {
  // --- Cuerpo ----------------------------------------------------------------
  let propiedadId = DEMO_PROPIEDAD_ID;
  try {
    const body = await request.json().catch(() => ({}));
    if (body && typeof body.propiedadId === 'string') {
      if (!UUID_RE.test(body.propiedadId)) {
        return errorJson('VALIDACION', 'propiedadId debe ser un UUID válido.', 400);
      }
      propiedadId = body.propiedadId;
    }
  } catch {
    return errorJson('VALIDACION', 'Cuerpo de la petición inválido.', 400);
  }

  // --- Selección de almacén + control de acceso ------------------------------
  let almacen: AlmacenInteligenciaPublica;

  if (isSupabaseConfigured()) {
    const sesion = await obtenerSesion();
    if (!sesion || !sesion.rol) {
      return errorJson('NO_AUTENTICADO', 'Se requiere sesión para ingestar.', 401);
    }
    if (!puede(sesion.rol, 'gestionar:datos-fan')) {
      return errorJson('PROHIBIDO', 'El rol no puede ejecutar la ingesta.', 403);
    }
    const supabase = await createClient();
    almacen = new SupabaseAlmacenInteligenciaPublica(supabase);
  } else {
    // Modo demo local: sin persistencia entre peticiones, demuestra el pipeline.
    almacen = new AlmacenInteligenciaPublicaEnMemoria();
  }

  // --- Ejecutar la ingesta ---------------------------------------------------
  try {
    const resultado = await ingestarSenalesPublicas(
      { fuente: new SeedPublicDataAdapter(), almacen },
      propiedadId,
    );
    return NextResponse.json(
      {
        modo: isSupabaseConfigured() ? 'persistido' : 'demo-memoria',
        ...resultado,
      },
      { status: 200 },
    );
  } catch (e) {
    // Una señal con PII o no agregada aborta la ingesta (AD-3).
    const message = e instanceof Error ? e.message : 'Error desconocido en la ingesta.';
    return errorJson('INGESTA_RECHAZADA', message, 422);
  }
}
