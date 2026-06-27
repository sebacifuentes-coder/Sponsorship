# Sponsorship — Copiloto de Patrocinio Deportivo

Plataforma en desarrollo siguiendo el **Método BMAD**. Capa de inteligencia y orquestación que ayuda al CMO de una marca patrocinadora a **explotar las oportunidades del patrocinio para maximizar el ROI** y a **demostrar su impacto ante el board**. Mercado inicial: fútbol, clubes de **LaLiga** (España).

> **Empieza por aquí:** [`docs/project-context.md`](docs/project-context.md) — contexto maestro, estado, decisiones vigentes y el estándar de gobernanza del proyecto.

## Estado

- ✅ **Fase 1 — Análisis:** brainstorming + intent doc.
- ✅ **Fase 2 — Planificación:** Product Brief (`ready`) y PRD (`final`, v2.4, validado con reviewer gate → grade Good).
- ⏳ **Fase 3 — Solución:** arquitectura, épicas e historias.
- ⏳ **Fase 4 — Implementación.**

## Flujo de trabajo

1. **Desarrollo local** con los agentes BMAD.
2. **Revisión en GitHub** — cada avance se versiona y se publica.
3. **Producción** — el desarrollador profesional revisa, refactoriza y lleva la plataforma a producción.

## Dónde está cada cosa

| Carpeta / archivo | Contenido |
|---|---|
| [`docs/project-context.md`](docs/project-context.md) | **Contexto maestro + estándar de gobernanza** (leer primero) |
| `_bmad-output/planning-artifacts/prds/` | **PRD** — verdad vigente y detallada del producto |
| `_bmad-output/planning-artifacts/briefs/` | Product Brief (resumen ejecutivo) |
| `_bmad-output/brainstorming/` | Intent doc (registro histórico de Fase 1) y memlog |
| `_bmad-output/implementation-artifacts/` | Artefactos del ciclo de implementación (Fase 4) |
| `_bmad-output/test-artifacts/` | Diseño y reportes de pruebas |
| `_bmad/` | Configuración del método BMAD |

## Para el desarrollador

Antes de revisar el código, lee `docs/project-context.md` y el PRD en `_bmad-output/planning-artifacts/prds/`: explican el *qué* y el *porqué* de cada decisión, los riesgos conocidos y las precondiciones de la Fase 1. Cada artefacto tiene su `.memlog.md` con la traza de decisiones.

## Estándar de gobernanza

Este proyecto se mantiene con documentación viva y coherente, trazabilidad de decisiones, gobernanza de datos GDPR como ciudadano de primera clase, y calidad verificada por revisión. El detalle está en `docs/project-context.md`.
