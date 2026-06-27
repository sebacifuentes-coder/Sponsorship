# `workers/` — Procesos del plano profundo (progresivo)

Procesos de segundo plano del **plano profundo**: ingesta de fuentes, sincronización de conectores martech, cómputo del Clean Room, motor de valor medible.

## Reglas

- **AD-1 — Nunca bloquean el plano ligero.** El plano profundo *eleva* la precisión de forma asíncrona; jamás es prerrequisito del primer valor (TTFV < 10 min). Si un worker falla o está pendiente, el plano ligero opera con el valor público y marca la precisión como "pendiente".
- **AD-7 — Los workers no escriben directo a tablas de dominio.** Mutan vía un caso de uso de `core/`, o escriben a una tabla de *staging* propia que `core/` promueve.
- **AD-2 — TypeScript por defecto.** Un worker Python solo puede añadirse en el plano profundo y siempre detrás de un puerto (AD-5). Diferido en el spine: solo si el procesamiento lo justifica.

> Historia 1.1 deja la estructura. Los workers entran con la Épica 4 (Clean Room) y la Épica 5 (valor medible).
