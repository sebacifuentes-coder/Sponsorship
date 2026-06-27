# Contexto del proyecto — MetodoBMAD · Copiloto de Patrocinio Deportivo

> Documento maestro de orientación. BMAD lo carga como contexto base (`persistent_facts`) en cada skill. Léelo primero. Para el detalle accionable y los requisitos, ve al **PRD**.

## 1. Estándar de gobernanza y documentación *(principio permanente — no negociable)*

Este proyecto se opera al más alto estándar de gobernanza y documentación. Reglas que rigen toda sesión y agente:

1. **La documentación se mantiene viva y coherente.** Cuando una decisión cambia el producto, se actualizan en la misma sesión todos los documentos afectados (PRD, brief, este contexto) para que ninguno contradiga a otro. No se dejan documentos desactualizados.
2. **Fuente única de verdad por capa.** El **PRD** es la verdad vigente y detallada del producto. El **brief** es el resumen ejecutivo alineado al PRD. Los artefactos de brainstorming son **registro histórico** (génesis) y no se reescriben; si quedan superados, se marcan como históricos con puntero a la verdad vigente.
3. **Trazabilidad total.** Cada decisión, cambio y supuesto se registra en el `.memlog.md` de su workflow (vía el script `memlog.py`), nunca a mano. Los supuestos se etiquetan `[SUPUESTO]` e se indexan; las decisiones pendientes del dueño se marcan `[DECISIÓN PENDIENTE — Seba]`.
4. **Gobernanza de datos como ciudadano de primera clase.** Régimen aplicable **GDPR (España/UE)**. Se distingue siempre first-party PII (vía clean room, con base legal) de datos públicos del hincha (agregados/anonimizados). Ninguna decisión de producto ignora privacidad/consentimiento.
5. **Calidad verificada.** Los artefactos clave pasan por el reviewer gate de BMAD (rúbrica + adversarial) antes de cerrarse; los hallazgos se resuelven o se elevan a riesgos/precondiciones con dueño.
6. **Versionado disciplinado.** Todo avance se versiona en Git y se publica a GitHub para revisión del desarrollador (`git add . && git commit -m "..." && git push`). Mensajes de commit descriptivos.
7. **Honestidad sobre completitud aparente.** Se prefiere nombrar lo que no está resuelto (riesgos, precondiciones) antes que aparentar certeza.
8. **Continuidad entre interfaces (no negociable).** Ante cualquier riesgo de pérdida de información o de caída de rendimiento (contexto saturado, cambio de herramienta, salto de Cowork a Claude Code/VS Code), se genera de inmediato un **paquete de continuidad**: un documento de handoff con (a) el estado actual del proyecto, (b) la lista exacta de documentos a analizar **ANTES** de ejecutar, y (c) el prompt correcto para retomar en la nueva interfaz. **Ninguna ejecución en una interfaz nueva comienza sin antes analizar la documentación previa.** El handoff vigente vive en `docs/HANDOFF-fase4-claude-code.md`.

## 2. Estado actual

- **Fase 1 (Análisis) — completa.** Brainstorming + intent doc.
- **Fase 2 (Planificación) — completa.** Product Brief (`ready`) y PRD (`final`, v2.4, grade de rúbrica: Good tras dos rondas de gate).
- **Fase 3 (Solución) — completa.** Arquitectura (spine `final`, 9 decisiones), épicas e historias (`epics.md` `final`: 5 épicas, 23 historias, revisadas por party multi-agente).
- **Fase 4 (Implementación) — en curso, en Claude Code / VS Code.** ✅ **Épica 1 (Cimientos + Primer valor / TTFV) completa** (historias 1.1–1.5, pusheadas a `main`): stack Next.js 16 + Supabase + Vercel AI SDK + Tailwind/shadcn, estructura modular del doble plano, RBAC básico, ingesta de datos públicos (semilla tras `PublicDataPort`), motor de oportunidades + priorización versionada, y onboarding de primer valor con TTFV instrumentado. Próximo: Épica 2. Detalle y prompt de arranque en `docs/HANDOFF-fase4-claude-code.md` (§1.5 = lo ya construido).

**Decisiones de arquitectura (resumen):** monolito modular de doble plano con puertos y adaptadores; stack TypeScript (Next.js 16 + Supabase + Vercel AI SDK); PII aislada en clean room (solo cruzan segmentos agregados); valor medible versionado y auditable (certificación separada del cobro); proveedores tras adaptadores; roles + RLS + multi-tenant por Propiedad. Detalle en `ARCHITECTURE-SPINE.md`.

## 3. Síntesis del producto

Copiloto de patrocinio deportivo: **capa de inteligencia y orquestación** (web app + integración) que ayuda al CMO de una marca patrocinadora a **explotar las oportunidades del patrocinio para maximizar el ROI** y a **demostrarlo ante el board**. No es un medidor (medir es soporte) ni un SaaS por suscripción (**precio por valor**). Mercado inicial: **fútbol, clubes de LaLiga (España)**. Restricción de diseño de máximo impacto: el **primer valor llega en < 10 min y ≤ 3 pasos (TTFV)**.

Estructura de tres jugadores: **Consultor** (construye/provee, ingresos vía consultora) → **Propiedad** (entidad deportiva; paga, distribuye, aporta datos+derechos) → **Marca/CMO** (usuario final).

## 4. Decisiones clave vigentes

- **Dos dolores:** demostrar/maximizar ROI **y** comprimir el ciclo de activación marca-agencia (self-serve).
- **Valor medible en dos niveles:** Nivel 1 trazabilidad dura (ciclo corto) · Nivel 2 proxy/incrementalidad acordada (ciclo largo, validar con CFO antes de cobrar).
- **TTFV < 10 min y ≤ 3 pasos:** primer valor genuino sobre datos públicos del **club y del hincha** (qué busca/consume/opina + narrativa social, agregados), sin esperar a la integración profunda. Mapeo a la estrella polar: búsqueda→momento, consumo→forma, opinión/narrativa→mensaje.
- **Arquitectura de doble camino:** ruta ligera para el primer valor + integración profunda (clean room + Salesforce/Adobe) progresiva en segundo plano.
- **Cobro desacoplado del piloto:** se activa tras auditoría de la metodología.
- **Beachhead:** sponsor de ciclo corto **legal** (e-commerce/delivery/consumo/fintech); apuestas quedan fuera por RD 958/2020.
- **Integración:** sigue al piloto (default Salesforce); LLM del proveedor (Azure/Google).
- **Foso a construir:** metodología de atribución certificada + dato propietario de benchmark + lock-in de dos lados.

## 5. Mapa de documentos

| Documento | Rol | Ruta |
|---|---|---|
| **PRD (v2.4, final)** | Verdad vigente y detallada | `_bmad-output/planning-artifacts/prds/prd-MetodoBMAD-2026-06-27/prd.md` |
| Product Brief (ready) | Resumen ejecutivo alineado al PRD | `_bmad-output/planning-artifacts/briefs/brief-MetodoBMAD-2026-06-27/brief.md` |
| Reportes de validación | Resultado del reviewer gate | `.../prds/.../validation-report.{html,md}` |
| **Architecture Spine (final)** | Contrato técnico de arquitectura | `_bmad-output/planning-artifacts/architecture/.../ARCHITECTURE-SPINE.md` |
| Explicador de arquitectura | Versión visual no técnica (para Seba) | `.../architecture/.../explicador-arquitectura.html` |
| Intent doc (histórico) | Génesis del brainstorming (Fase 1) | `_bmad-output/brainstorming/brainstorm-.../brainstorm-intent.md` |
| `.memlog.md` (por workflow) | Memoria/auditoría de decisiones | en cada carpeta de workflow |
| Este documento | Contexto maestro + estándar | `docs/project-context.md` |

## 6. Flujo de trabajo

Desarrollo local con agentes BMAD → versionado en Git → publicación en GitHub (`github.com/sebacifuentes-coder/Sponsorship`) para revisión del desarrollador → producción profesional.

## 7. Precondiciones de Fase 1 (gates, acciones reales de Seba)

P-1 term sheet con una propiedad · P-2 estándar de evidencia validado con un CFO · P-4 madurez de datos + base legal GDPR · P-5 go-to-market. (Detalle en §10 del PRD.)

## 8. Próximo paso

Planificación (Fases 1-3) completa. **Fase 4 — Implementación** se ejecuta en **Claude Code / VS Code conectado a Claude**, empezando por la Épica 1. Antes de cualquier ejecución, leer la documentación previa según `docs/HANDOFF-fase4-claude-code.md`.
