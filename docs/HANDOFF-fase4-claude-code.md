# HANDOFF — Fase 4 (Implementación) en Claude Code / VS Code

> Paquete de continuidad para retomar el proyecto en **Claude Code o VS Code conectado a Claude**, sin perder información. Generado al cerrar la planificación en Cowork (Fases 1-3 completas).

## 0. Regla de oro (leer antes de ejecutar)

**No escribas ni una línea de código antes de analizar la documentación previa.** El orden de lectura obligatorio está en §2. Esto es gobernanza del proyecto, no una sugerencia.

## 1. Estado del proyecto

- **Producto:** Copiloto de Patrocinio Deportivo. Capa de inteligencia y orquestación que ayuda al CMO de una marca patrocinadora a explotar el patrocinio para maximizar el ROI y demostrarlo ante el board. Mercado inicial: fútbol, clubes de LaLiga (España).
- **Fases 1-3 completas:** brainstorming → brief → PRD (final, v2.5) → arquitectura (spine final, 9 decisiones) → épicas e historias (final: 5 épicas, 23 historias).
- **Repo:** https://github.com/sebacifuentes-coder/Sponsorship (rama `main`).
- **Ahora toca:** Fase 4 — implementar, empezando por la **Épica 1** (Cimientos + Primer valor / TTFV).

## 2. Documentación a analizar ANTES de ejecutar (orden obligatorio)

1. `docs/project-context.md` — contexto maestro + estándar de gobernanza (incluye las 8 reglas).
2. `_bmad-output/planning-artifacts/prds/prd-MetodoBMAD-2026-06-27/prd.md` — el qué y el porqué (FR-1 a FR-18, NFRs, riesgos, precondiciones).
3. `_bmad-output/planning-artifacts/architecture/architecture-MetodoBMAD-2026-06-27/ARCHITECTURE-SPINE.md` — los 9 invariantes (AD-1..AD-9), stack, estructura de carpetas, reglas de dependencia.
4. `_bmad-output/planning-artifacts/epics.md` — las 23 historias con criterios de aceptación; es el plan de construcción.
5. (Opcional) `_bmad-output/planning-artifacts/briefs/.../brief.md` y los `.memlog.md` para la traza de decisiones.

## 3. Reglas de gobernanza a respetar durante la implementación

- Documentación viva y coherente; el PRD/spine/epics son la fuente de verdad. Si algo cambia, se actualiza el documento afectado.
- Respetar los invariantes de arquitectura (AD-1..AD-9): doble plano, PII solo en clean room, adaptadores para lo externo, un dueño por dato, RBAC+RLS, etc.
- TTFV < 10 min / ≤ 3 pasos es restricción dura.
- Secretos en variables de entorno, nunca en el repo.
- Versionar por historia: `git add . && git commit -m "feat(epic1.story1): ..." && git push`.
- Test-first donde aplique; cada historia se cierra cuando sus criterios de aceptación pasan.
- **Continuidad:** si el contexto se satura o hay riesgo de pérdida de info, generar un nuevo handoff antes de seguir.

## 4. Setup inicial (una vez)

1. Clonar el repo: `git clone https://github.com/sebacifuentes-coder/Sponsorship.git`
2. Abrirlo en Claude Code o VS Code con Claude.
3. (Opcional) Los agentes BMAD están como skills en `.claude/skills/` — el agente **Dev (Amelia)** se invoca con `/bmad-agent-dev` y el ciclo de implementación con `/bmad-dev-story`.
4. Crear proyecto en Supabase y app en Vercel cuando se llegue a desplegar (no es prerrequisito para el primer valor local).

## 5. PROMPT DE ARRANQUE (copiar y pegar en Claude Code / VS Code)

```
Soy Seba. Estás retomando el proyecto "Copiloto de Patrocinio Deportivo" (repo Sponsorship) en fase de IMPLEMENTACIÓN.

ANTES DE ESCRIBIR CÓDIGO, lee y analiza en este orden:
1. docs/project-context.md (contexto + las 8 reglas de gobernanza)
2. _bmad-output/planning-artifacts/prds/prd-MetodoBMAD-2026-06-27/prd.md
3. _bmad-output/planning-artifacts/architecture/architecture-MetodoBMAD-2026-06-27/ARCHITECTURE-SPINE.md
4. _bmad-output/planning-artifacts/epics.md

Cuando termines de leer, hazme un resumen de 5 líneas de: el producto, los 9 invariantes de arquitectura, y la Épica 1 con sus historias. Espera mi OK.

Tras mi OK, implementamos la Fase 4 empezando por la Épica 1, Historia 1.1 (montaje del proyecto: Next.js 16 App Router + Supabase + Vercel AI SDK + Tailwind/shadcn, estructura modular app/ core/ ports/ adapters/ workers/ data/, auth Supabase con RBAC básico de 3 roles, secretos fuera del repo). Sigue los criterios de aceptación de epics.md al pie de la letra y respeta los AD-1..AD-9. Trabaja historia por historia, en orden, y haz commit por historia. No avances a la siguiente historia sin que los criterios de aceptación de la actual estén cumplidos.

Regla de gobernanza activa: si en algún momento el contexto se satura o hay riesgo de perder información, genérame un nuevo documento de handoff antes de continuar.
```

## 6. Orden de construcción sugerido

Épica 1 (1.1 → 1.2 → 1.3 → 1.4 → 1.5) entrega la demo de Fase 0 (primer valor). Luego Épica 2 (personalización), Épica 3 (generación/activación + trazabilidad 3.5), Épica 4 (clean room), Épica 5 (valor medible). Cada épica funciona de forma independiente sobre las anteriores.

## 7. Precondiciones de negocio en paralelo (no bloquean el código, pero sí el piloto real)

P-1 term sheet con un club · P-2 estándar de evidencia validado con un CFO · P-4 madurez de datos + base legal GDPR · P-5 go-to-market. (Detalle en §10 del PRD.)
