# Mini-spec UX — Onboarding de primer valor (TTFV)

> **Historia 1.5** (Épica 1, FR-14). Este mini-spec define el primer flujo del producto **antes** de implementarlo, porque no hubo documento UX en la planificación (epics.md lo encarga a esta historia). Restricción dura (NFR-1, SM-5): **primer valor en < 10 min y ≤ 3 pasos**, sobre datos públicos, **sin** conectar Salesforce/Adobe ni el Clean Room (AD-1).

## Objetivo

Que un CMO o consultor nuevo perciba valor real en su primer uso: un **mapa de oportunidades priorizado** + un **concepto de activación**, en exactamente **3 pasos** y en minutos. El tiempo al primer valor queda **instrumentado** (métrica TTFV).

## Principios

- **≤ 3 pasos, sin desvíos.** Nada de registro largo, integraciones ni carga de datos del fan (NFR-4). El brief mínimo (marca + objetivo) no es carga de datos del fan.
- **Degradación elegante (AD-1).** Si el plano profundo no está, se opera con datos públicos y la precisión se marca como "básica/pendiente" — nunca un bloqueo.
- **Valor genuino, no demo vacío.** El resultado habla del hincha (intención/consumo/opinión/narrativa), no solo del club.

## Los 3 pasos

### Paso 1 — Elegir club (Propiedad)
- **Contenido:** selector de club LaLiga (lista semilla en el MVP). Una sola elección.
- **Salida:** `propiedadId`.
- **Microcopy:** "¿Sobre qué club quieres activar el patrocinio?"

### Paso 2 — Marca y objetivo mínimo
- **Contenido:** nombre de la marca (texto) + objetivo de comunicación (selector: awareness · consideración · conversión · lanzamiento). Captura progresiva: lo demás se enriquece luego (Épica 2), nunca bloquea aquí.
- **Salida:** `{ marca, objetivo }`.
- **Microcopy:** "¿Qué marca y qué busca esta campaña?"

### Paso 3 — Ver resultado (primer valor)
- **Contenido:**
  - **Mapa de oportunidades** priorizado (reusa Historias 1.3/1.4): top oportunidades con segmento, señal de origen, hipótesis y valor potencial.
  - **Concepto de activación** sobre la oportunidad de mayor valor: ángulo de mensaje, canal sugerido, segmento y llamada a la acción. *(Determinista en el plano ligero; la generación creativa con IA llega en la Épica 3, FR-5.)*
  - Sello de **TTFV**: tiempo transcurrido desde el Paso 1.
- **Microcopy:** "Tu primer valor en {mm:ss}."

## Instrumentación TTFV

- Se marca `inicio` al entrar al Paso 1 (reloj de cliente, `performance.now()`).
- Al renderizar el resultado del Paso 3 se calcula `duracionMs` y se registra un **evento TTFV** (`POST /api/ttfv`) con `{ propiedadId, marca, objetivo, pasos: 3, duracionMs }`.
- El evento se registra como log estructurado y se persiste si Supabase está configurado (`ttfv_eventos`). Es invariante de producto (spine §Observabilidad).
- **Criterio de éxito:** mediana de `duracionMs` por debajo de 10 min; `pasos` siempre = 3.

## Fuera de alcance (de esta historia)

- Personalización profunda por contexto de marca (Épica 2).
- Generación creativa con IA del concepto (Épica 3, FR-5).
- First-party / Clean Room (Épica 4). El primer valor no lo espera (AD-1).
