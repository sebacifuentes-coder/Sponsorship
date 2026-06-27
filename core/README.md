# `core/` — Núcleo de dominio

Dominio puro del Copiloto. **No depende de framework ni de proveedores** (AD-2, dirección de dependencias del spine). `app/`, `workers/` y `adapters/` dependen de `core/`, nunca al revés.

## Reglas que viven aquí

- **AD-7 — Una entidad, un módulo dueño de su estado.** Cada entidad de dominio tiene un único módulo que muta su estado. Ningún worker ni adaptador escribe directo a tablas de dominio: mutan vía un caso de uso de `core/`.
  - `Activacion` → `core/activations`
  - `Oportunidad` → `core/opportunities`
  - `EventoDeValor` y `Metodologia` → `core/attribution`
  - Contexto de marca/derechos → `core/context`
  - Inteligencia pública (sin PII) → `core/intelligence`
- **AD-1 — Doble plano.** El plano ligero (`intelligence`, `opportunities`, `context`) no puede depender del plano profundo (`attribution`, clean room). El profundo *eleva* la precisión de forma asíncrona; nunca es prerrequisito.
- **Nombres (spine):** entidades del Glosario del PRD en singular (`Propiedad`, `Marca`, `Oportunidad`, `Activacion`, `EventoDeValor`); eventos en pasado (`ActivacionPublicada`).

## Módulos

| Módulo | Responsabilidad | Plano | FRs |
|---|---|---|---|
| `shared/` | Tipos transversales del dominio (roles, tenancy por Propiedad) | — | AD-9 |
| `intelligence/` | Inteligencia pública del club y del hincha (sin PII) | Ligero | FR-3, FR-14 |
| `context/` | Contexto de marca y patrocinio (derechos, ADN, objetivos) | Ligero | FR-15..FR-18 |
| `opportunities/` | Identificación y priorización de oportunidades | Ligero | FR-3, FR-4 |
| `activations/` | Generación, aprobación y publicación de activaciones | — | FR-5, FR-6, FR-7 |
| `attribution/` | Metodología versionada y eventos de valor auditables | Profundo | FR-8..FR-12 |

> Historia 1.1 deja la estructura y los tipos transversales (`shared/`). Cada módulo se rellena en su épica correspondiente.
