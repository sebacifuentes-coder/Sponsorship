# HANDOFF — Fase 4 (Implementación) en Claude Code / VS Code

> Paquete de continuidad para retomar el proyecto en **Claude Code o VS Code conectado a Claude**, sin perder información. **Actualizado al cerrar la Épica 1** (2026-06-27).

## 0. Regla de oro (leer antes de ejecutar)

**No escribas ni una línea de código antes de analizar la documentación previa.** El orden de lectura obligatorio está en §2. Esto es gobernanza del proyecto, no una sugerencia.

## 1. Estado del proyecto

- **Producto:** Copiloto de Patrocinio Deportivo. Capa de inteligencia y orquestación que ayuda al CMO de una marca patrocinadora a explotar el patrocinio para maximizar el ROI y demostrarlo ante el board. Mercado inicial: fútbol, clubes de LaLiga (España).
- **Fases 1-3 completas:** brainstorming → brief → PRD (final, v2.5) → arquitectura (spine final, 9 decisiones) → épicas e historias (final: 5 épicas, 23 historias).
- **Fase 4 en curso. ✅ Épica 1 COMPLETA** (historias 1.1–1.5), verificada y pusheada a `main`.
- **Repo:** https://github.com/sebacifuentes-coder/Sponsorship (rama `main`).
- **Próximo:** **Épica 2 — Contexto y personalización** (FR-15..FR-18), historias 2.1 → 2.5.

## 1.5. Lo construido en la Épica 1 (qué ya existe en el repo)

Stack montado (AD-2): **Next.js 16.2.9** (App Router, Turbopack) + React 19 + Supabase (`@supabase/ssr`) + Vercel AI SDK + Tailwind v4 + shadcn/ui, TypeScript estricto. Verificación por historia: `npm run typecheck && npm run lint && npm run build` limpios.

Estructura modular del doble plano (cada carpeta con README del invariante que la gobierna):
- `core/` dominio puro — `shared/` (roles RBAC, tenant), `intelligence/` (señales públicas, ingesta), `opportunities/` (generar + priorizar), `activations/` (concepto). Pendientes: `context/` (Épica 2), `attribution/` (Épica 5).
- `ports/` — `public-data-port.ts`. `adapters/` — `publicdata/seed-public-data-adapter.ts` (resto: gitkeep).
- `lib/` — `env.ts`, `supabase/` (client/server/middleware), `auth/session.ts`, `repositories/intelligence-repository.ts`, `intelligence/` (leer-senales, clubes-semilla), `observability/ttfv.ts`.
- `app/` — home, `oportunidades/` (dashboard priorizado), `onboarding/` (wizard 3 pasos), `api/intelligence/ingest`, `api/onboarding/primer-valor`, `api/ttfv`. `proxy.ts` (sesión Supabase, convención Next 16).
- `data/migrations/` — `0001_rbac_basico.sql` (roles + tenancy + RLS), `0002_inteligencia_publica.sql` (señales sin PII), `0003_ttfv.sql`.

Decisiones clave tomadas durante la Épica 1:
- **Datos públicos = semilla/muestra tras `PublicDataPort`** (decisión de Seba; ruta R-9). Las **fuentes reales por categoría quedan como [DECISIÓN PENDIENTE — Seba]**, se cablean detrás del puerto sin tocar el núcleo.
- La app **corre en local sin Supabase** (modo demo en memoria); auth/RLS/persistencia se activan al configurar `.env.local` (ver `.env.example`).
- El RLS **reforzado del Clean Room** y el first-party quedan para la **Épica 4** (la Historia 1.1 dejó el RBAC básico).
- Generación de oportunidades y concepto son **deterministas**; la **creatividad con IA es la Épica 3** (FR-5).
- Mini-spec UX del primer flujo: `docs/ux/onboarding-ttfv-mini-spec.md`.

Cómo probarlo localmente: `npm install` → `npm run dev` → abrir `/onboarding` (primer valor en 3 pasos) y `/oportunidades` (mapa priorizado). Ingesta demo: `POST /api/intelligence/ingest`.

## 2. Documentación a analizar ANTES de ejecutar (orden obligatorio)

1. `docs/project-context.md` — contexto maestro + estándar de gobernanza (8 reglas).
2. `_bmad-output/planning-artifacts/prds/prd-MetodoBMAD-2026-06-27/prd.md` — el qué y el porqué (FR-1 a FR-18, NFRs, riesgos, precondiciones).
3. `_bmad-output/planning-artifacts/architecture/architecture-MetodoBMAD-2026-06-27/ARCHITECTURE-SPINE.md` — los 9 invariantes (AD-1..AD-9), stack, estructura, reglas de dependencia.
4. `_bmad-output/planning-artifacts/epics.md` — las 23 historias con criterios de aceptación.
5. **Este handoff** (§1.5) — qué ya está construido, para no rehacerlo.
6. (Opcional) `docs/ux/onboarding-ttfv-mini-spec.md` y los `.memlog.md`.

## 3. Reglas de gobernanza a respetar durante la implementación

- Documentación viva y coherente; PRD/spine/epics son la fuente de verdad.
- Respetar los invariantes AD-1..AD-9: doble plano, PII solo en clean room, adaptadores para lo externo, un dueño por dato, RBAC+RLS, secretos fuera del repo.
- TTFV < 10 min / ≤ 3 pasos es restricción dura (ya instrumentada en `lib/observability/ttfv.ts`).
- Versionar **por historia**: `git add . && git commit -m "feat(epicaN/historiaN.M): ..." && git push`.
- Cada historia se cierra cuando **sus criterios de aceptación pasan** (verificados con typecheck/lint/build y prueba en runtime).
- **Continuidad:** si el contexto se satura o hay riesgo de pérdida de info, generar un nuevo handoff antes de seguir.

## 4. Setup inicial (una vez)

1. Clonar el repo: `git clone https://github.com/sebacifuentes-coder/Sponsorship.git`
2. `npm install`. Copiar `.env.example` → `.env.local` (opcional; la app corre sin credenciales en modo demo).
3. Crear proyecto en Supabase y aplicar `data/migrations/*.sql` cuando se quiera persistencia/RLS reales. App en Vercel al desplegar (no es prerrequisito del primer valor local).

## 5. PROMPT DE ARRANQUE (copiar y pegar para retomar en una sesión nueva)

```
Soy Seba. Estás retomando el proyecto "Copiloto de Patrocinio Deportivo" (repo Sponsorship) en Fase 4 (IMPLEMENTACIÓN). La Épica 1 ya está completa y pusheada.

ANTES DE ESCRIBIR CÓDIGO, lee y analiza en este orden:
1. docs/project-context.md (contexto + 8 reglas de gobernanza)
2. docs/HANDOFF-fase4-claude-code.md (estado actual; §1.5 = lo ya construido)
3. _bmad-output/planning-artifacts/prds/prd-MetodoBMAD-2026-06-27/prd.md
4. _bmad-output/planning-artifacts/architecture/architecture-MetodoBMAD-2026-06-27/ARCHITECTURE-SPINE.md
5. _bmad-output/planning-artifacts/epics.md

Cuando termines, hazme un resumen de 5 líneas de: el estado de la Épica 1, los AD-1..AD-9, y la Épica 2 con sus historias. Espera mi OK.

Tras mi OK, continúa la Fase 4 con la Épica 2 (Contexto y personalización), historia por historia, en orden (2.1 → 2.5). Sigue los criterios de aceptación de epics.md al pie de la letra, respeta AD-1..AD-9, no rehagas lo que el handoff §1.5 marca como ya construido, y haz commit+push por historia. No avances a la siguiente historia sin cerrar los AC de la actual.

Regla de gobernanza activa: si el contexto se satura, genérame un nuevo handoff antes de continuar.
```

## 6. Orden de construcción restante

✅ Épica 1 (Cimientos + Primer valor) — **completa**.
➡️ Épica 2 (personalización: derechos, ADN de marca, objetivos, contexto). Épica 3 (generación/activación + trazabilidad 3.5). Épica 4 (clean room). Épica 5 (valor medible). Cada épica funciona sobre las anteriores.

## 7. Precondiciones de negocio en paralelo (no bloquean el código, pero sí el piloto real)

P-1 term sheet con un club · P-2 estándar de evidencia validado con un CFO · P-4 madurez de datos + base legal GDPR · P-5 go-to-market. (Detalle en §10 del PRD.)

Decisiones de producto que el código está esperando: **fuentes reales de datos públicos** por categoría (hoy semilla tras `PublicDataPort`).
