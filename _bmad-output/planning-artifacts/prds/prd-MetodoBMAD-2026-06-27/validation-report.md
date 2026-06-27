# Reporte de Validación PRD — Copiloto de Patrocinio Deportivo

- **PRD:** `_bmad-output/planning-artifacts/prds/prd-MetodoBMAD-2026-06-27/prd.md` (v2.1)
- **Rúbrica:** `.claude/skills/bmad-prd/assets/prd-validation-checklist.md`
- **Generado:** 2026-06-27T00:00:00Z
- **Grade:** **Good** — calidad de documento, con riesgos críticos de negocio y coherencia abiertos (re-validación; la v1 obtuvo Fair)

---

## Veredicto general

Como documento, este PRD es **bueno y listo para alimentar el chain con gates**. Sostiene una tesis nítida (visibilidad → efectividad demostrable), trata sus tensiones más peligrosas con honestidad inusual (sobre-atribución del lado del vendedor, ciclo largo de los sponsors de LaLiga, la agencia como bloqueador, el choque TTFV↔integración enterprise) y las convierte en mecanismos verificables (FR-12, SM-C1, precondiciones P-1..P-5, riesgos R-1..R-9). La rúbrica de 7 dimensiones da **0 critical, 0 high y 2 medium**, ambos en Done-ness y corregibles antes de épicas. El salto frente a la v1 (Fair) es claro: lo que eran "supuestos" hoy son precondiciones con dueño, hay control duro del sesgo del vendedor, mercado/jurisdicción fijados (LaLiga/GDPR), y aparecen GTM, riesgos, competencia y foso. **Por calidad de documento, el grade es Good.**

**El revisor adversarial matiza materialmente ese veredicto.** Su tesis es que *nombrar un riesgo no es mitigarlo*: la mayoría de los críticos previos siguen abiertos, solo que ahora con etiqueta de "precondición" o "[DECISIÓN PENDIENTE]". Levanta un crítico nuevo de viabilidad legal —el beachhead recomendado de apuestas/iGaming está prohibido o severamente restringido en el fútbol español por el **Real Decreto 958/2020** desde 2021— y una contradicción interna dura: el **TTFV <10 min** solo se cumple con datos de muestra (demo vacío que rompe la promesa de valor diferencial) o exigiría datos reales del fan que el propio PRD declara bloqueados semanas por madurez de datos, diseño de clean room y base legal GDPR (P-4). Además el círculo vicioso de atribución cobrable (H-5) sigue vivo para el grueso del mercado (Nivel 2), y ninguna métrica prueba que alguien paga. Veredicto consolidado: **Good (calidad de documento) con riesgos críticos de negocio y coherencia abiertos** — bien construido y correctamente *gated*, pero su viabilidad comercial y legal sigue sin demostrarse; no leer como luz verde a construir.

---

## Veredictos por dimensión

| # | Dimensión | Veredicto |
|---|-----------|-----------|
| 1 | Decision-readiness | strong |
| 2 | Substance over theater | strong |
| 3 | Strategic coherence | strong |
| 4 | Done-ness clarity | adequate |
| 5 | Scope honesty | strong |
| 6 | Downstream usability | strong |
| 7 | Shape fit | strong |

**Recuento adversarial:** críticos previos — 0 resueltos de verdad, 1 mitigado en diseño (H-2), 2 parciales (H-1, H-7), 1 abierto en su núcleo (H-5). Nuevos en v2.1 — 1 crítico (beachhead apuestas), 2 altos, 2 medios, 1 bajo.

---

## Hallazgos por severidad

### Critical

- **[Adversarial] H-NUEVO-1 — Beachhead apuestas/iGaming prohibido o restringido en España** (`§2.2, §4.6 Nivel 1, §6.1`)
  El PRD recomienda probar primero con un sponsor de ciclo corto "apuestas/iGaming o e-commerce de un club LaLiga" por su trazabilidad dura. El Real Decreto 958/2020 prohíbe desde 2021 el patrocinio de equipos de fútbol por casas de apuestas y restringe drásticamente su publicidad en España. El segmento "más cobrable" es, en el mercado elegido, el menos viable legalmente.
  *Fix:* eliminar apuestas/iGaming del beachhead español; reanclar el ejemplo de ciclo corto en e-commerce/retail con conversión trazable; verificar con asesoría legal qué verticales de ciclo corto son patrocinadores legales de clubes LaLiga.

- **[Adversarial] Contradicción TTFV <10 min ↔ valor real requiere datos del fan (semanas + GDPR)** (`FR-14 / §4.8 / NFR TTFV, R-9`)
  Si la oportunidad de los primeros 10 min usa datos de muestra/semilla, no es real ni atribuible: es el demo de Fase 0 disfrazado de "primer valor" y rompe la promesa (el valor diferencial ES la especificidad de los datos del fan). Si usara datos reales en <10 min, sería incompatible con P-4 (madurez), base legal GDPR, clean room y consentimiento que no se extiende a la Marca. No puede coexistir "datos reales en 10 min" con "acceso a datos del fan es un gate legal de Fase 1". El "<10 min" se vende como argumento de entrada (SM-5): es onboarding, no entrega de valor — reabre R-6 por la puerta de atrás.
  *Fix:* reescribir FR-14/TTFV: decidir si la ruta ligera entrega valor real o es onboarding/demo, y dejar de venderla como "primer valor". No prometer valor diferencial sobre datos de muestra.

- **[Adversarial] H-5 — Círculo vicioso de atribución cobrable ABIERTO para el grueso del mercado** (`§4.6 Nivel 2, P-2, §6.2`)
  La v2.1 no rompe el círculo, lo segmenta. Nivel 1 es cobrable pero solo aplica a ciclo corto (cupón/UTM/QR), minoría de LaLiga y segmento regulatoriamente tóxico. Nivel 2 (la mayoría del dinero: aerolíneas, banca, autos, telco) sigue en el círculo: cobrable "después de que un CFO valide el estándar (P-2)", y la incrementalidad real que lo haría defendible está fuera del MVP (v2). El MVP no puede cobrar al grueso del mercado que eligió.
  *Fix:* resolver H-5 para Nivel 2 o aceptar formalmente que v1 solo cobra Nivel 1 — y verificar que existe un comprador Nivel 1 legal en LaLiga (no apuestas).

- **[Adversarial] H-1 — Cobro sin contrato ni marco legal: P-1 es una precondición vacía** (`P-1, FR-11`)
  P-1 lista las preguntas difíciles (qué es valor, quién audita, qué pasa en disputa) y las pospone: sin borrador de cláusulas, estructura de reparto ni árbitro nombrado. FR-11 desacopla el cobro del piloto (reduce riesgo en Fase 1) pero el modelo de negocio nunca se prueba en el piloto: valida la herramienta, no el negocio. Abierto en sustancia.
  *Fix:* dotar a P-1 de borrador de cláusulas, estructura de reparto y mecanismo de árbitro antes de comprometer el modelo de cobro.

- **[Adversarial] H-7 — Dependencia de datos/derechos de la Propiedad; clean room sobrecargado** (`P-4, §16, glosario, FR-2`)
  P-4 es correcto en estructura, pero (a) depende de que clubes concretos de LaLiga tengan madurez de datos — no demostrado; (b) el clean room se invoca como bala de plata legal sin diseño técnico ni dictamen; (c) §16 admite que el consentimiento del fan al club no se extiende a la Marca bajo GDPR — el clean room mitiga pero no necesariamente resuelve (activar sobre segmentos modelados también es tratamiento de datos). Abierto.
  *Fix:* P-4 debe exigir dictamen legal específico sobre si la activación vía clean room constituye base legal suficiente, no asumirlo.

### High

- **[Adversarial] H-NUEVO-2 — La métrica primaria (SM-1) ya no mide negocio, y nada lo sustituye** (`§7 SM-1`)
  SM-1 se redefinió a "4 clubes probando + feedback, aunque no haya venta": actividad/aprendizaje. Ninguna métrica prueba que el precio por valor funciona: cobro desacoplado (FR-11), Nivel 2 no cobrable (P-2), SM-3 cuenta eventos "sin cobro", SM-4 "≥1 caso" aspiracional. El PRD puede "tener éxito" en todas sus métricas sin demostrar que alguien paga.
  *Fix:* añadir una métrica de validación comercial real (≥1 cliente que firme term sheet con disposición a pagar sobre Nivel 1, o un test de precio con CFO), separada de la adopción.

- **[Adversarial] H-NUEVO-3 — El piloto valida la herramienta pero deja el negocio sin probar** (`§6.1 Fase 1, FR-11`)
  Al desacoplar el cobro (mitigación legítima de H-1/H-2), la Fase 1 prueba que la herramienta genera y certifica valor, pero no la única hipótesis que mata el negocio si es falsa: que un cliente pague. Se difiere a "una fase posterior tras auditoría" no planificada ni datada. Riesgo de construir todo y descubrir la inviabilidad comercial al final.
  *Fix:* definir una Fase 1.5 / criterio de salida que ponga a prueba la disposición a pagar (cobro simbólico o compromiso contractual de pago condicionado) antes de escalar.

- **[Adversarial] H-4 — Ciclo de venta largo AGRAVADO por la decisión de mercado** (`R-4, §2.2`)
  Elegir LaLiga con sponsors de ciclo largo (aerolíneas, banca, autos, telco) hace lentas la venta, la firma de metodología y la materialización del valor. La "mitigación" (beachhead de ciclo corto) no está decidida y choca con la restricción de apuestas (H-NUEVO-1). Abierto y, en parte, internamente contradictorio.
  *Fix:* decidir el beachhead con un vertical de ciclo corto legal y cobrable en LaLiga; cuantificar el ciclo de venta esperado por vertical.

- **[Adversarial] H-12 — Sin foso defensivo; foso negativo** (`§12, R-8`)
  §12 lista 4 fosos candidatos y cierra con [DECISIÓN PENDIENTE]. Listar fosos no es tener uno. R-8 admite que incumbentes con distribución (Salesforce/Adobe) u holdings (WPP/Publicis) pueden copiarlo, y que el producto se monta sobre el stack de esos mismos incumbentes, dándoles visibilidad directa de la oportunidad: foso negativo. Abierto y subestimado.
  *Fix:* elegir el foso de §12 y especificar cómo se evita exponer la jugada a los incumbentes sobre cuyo stack se monta.

- **[Adversarial] H-11 — Agencia con poder de bloqueo; contradicción autonomía↔agencia** (`§2.1, §4.4, R-7`)
  La "mitigación" es "validar con CMOs reales y mapear accesos en el piloto" — posponer. El JTBD del CMO (§2.1) es activar "sin depender del ciclo lento con la agencia", mientras §4.4 dice que la agencia puede operar el canal. El producto promete autonomía y admite que la agencia controla el grifo. No resuelta.
  *Fix:* decidir el modelo: autonomía real (con acceso a canales que no pasen por la agencia) o reposicionar el beneficio del CMO de "autonomía" a "velocidad/calidad de la propuesta a la agencia". No ambos.

### Medium

- **[Rúbrica · Done-ness] "Minutos" sin bound en generación** (`FR-5, §17 "Tiempo de generación"`)
  Criterio de done no testable; un ingeniero no sabe si 9 min cumple.
  *Fix:* fijar umbral numérico (≤ N min) o referenciar un NFR con número, como hace FR-14 con SM-5.

- **[Rúbrica · Done-ness] "Máximo acotado" de pasos sin número** (`FR-14, SM-5`)
  El segundo criterio de SM-5 (nº de pasos) no tiene valor concreto, así que no es verificable.
  *Fix:* fijar máximo de pasos hasta primer valor (≤ 3 pasos).

- **[Adversarial] H-NUEVO-4 — Clean room invocado como solución legal universal sin diseño ni dictamen** (`glosario, FR-2, §16, R-3`)
  "Clean room" aparece como respuesta a base legal, consentimiento, residencia, retención y "no transferir PII a la Marca". Activar sobre segmentos modelados sigue siendo tratamiento de datos bajo GDPR y requiere base legal propia; el clean room reduce exposición de PII pero no crea la base de legitimación. Se carga un patrón técnico con una conclusión jurídica no validada.
  *Fix:* bajar el tono de glosario/§16 de "mitiga/resuelve" a "diseño a validar legalmente"; exigir dictamen en P-4.

- **[Adversarial] H-NUEVO-5 — Acumulación de [DECISIÓN PENDIENTE] críticas: el PRD no es accionable como gate** (`transversal: §2.2, FR-11, §11, §12, P-1..P-5`)
  Las palancas de viabilidad —beachhead, desacople de cobro, GTM, foso, reparto de valor, estándar de evidencia— están TODAS pendientes. Un PRD que pasa el gate con sus cinco palancas sin decidir es un brief de decisiones pendientes. Riesgo de que UX/arquitectura arranquen sobre fundaciones que pueden cambiar de raíz.
  *Fix:* marcar que NINGÚN workflow posterior arranca hasta cerrar P-1, P-2, P-4 y el beachhead, como condición dura que bloquea el avance.

- **[Adversarial] H-9 / H-6 / H-8 — Mitigaciones que son la propia precondición (GTM vacío, CFO, base legal)** (`§11, P-2, P-4`)
  §11 GTM es un formulario en blanco; SM-1 pide "4 clubes probando" sin una Propiedad nombrada. H-6 (atribución que no resiste a un CFO escéptico) y H-8 (base legal GDPR) movidos a P-2/P-4 sin dictamen: la solución es la precondición. Honesto al admitirlo, no resuelto.
  *Fix:* llenar §11 con Propiedades y contactos reales o bajar SM-1 a hipótesis no comprometida; cerrar P-2 con un CFO real y P-4 con dictamen legal antes de cobrar.

### Low

- **[Rúbrica · Decision-readiness] Beachhead aún pendiente** (`§2.2`) — la decisión más consecuente del plan de validación sigue como [DECISIÓN PENDIENTE — Seba]; cambia qué se construye primero. *Fix:* convertir en P-6 o anexarlo a P-1 con fecha.
- **[Rúbrica · Strategic coherence] SM-1 mezcla aprendizaje con conversión** (`§7`) — "4 clubes probando" + "≥1 club que comprometa datos reales" son dos cosas en una SM. *Fix:* desdoblar en SM-1a (uso) y SM-1b (conversión).
- **[Rúbrica · Done-ness] FR-1 estado "conectada/error" no cubre estados intermedios** (`FR-1`) — enumeración cerrada puede quedar corta (parcial, autenticando). *Fix:* permitir "en progreso" o aclarar que es binario a propósito.
- **[Rúbrica · Scope honesty] §11 Go-to-Market es todo [DECISIÓN PENDIENTE]** (`§11`) — honesto, pero P-5 depende de esta sección y queda como esqueleto. *Fix:* poblar antes de comprometer SM-1.
- **[Rúbrica · Downstream usability] Hallazgos H-1..H-16 referenciados sin índice local** (`varias secciones`) — los IDs viven en el review externo; un downstream que solo lea el PRD no puede resolverlos. *Fix:* nota al pie o tabla de mapeo.
- **[Adversarial] H-NUEVO-6 — Contradicción de framing CMO vs. agencia sin reconciliar** (`§2.1 vs. §4.4 / R-7`) — la v2.1 introdujo la nota de §4.4 sin reconciliarla con el JTBD que la contradice. *Fix:* decidir y declarar un único modelo (autonomía real o velocidad/calidad de la propuesta a la agencia).

---

## Notas mecánicas

- **Glossary drift:** no material. "Entidad deportiva" es alias declarado de "Propiedad". Leve desincronía: "Valor medible (v1)" en Glosario define solo Nivel 1, mientras §4.6 lo expande a dos niveles. *Fix menor:* actualizar la entrada del Glosario.
- **Continuidad de IDs:** FR-1..FR-14 contiguos; SM, UJ, P, R sin huecos ni duplicados. OK.
- **Roundtrip de supuestos:** los [ASSUMPTION] inline aparecen en el Índice (§9) y viceversa; varios se elevan a precondiciones (P-1, P-2, P-4). OK.
- **Naming de protagonistas en UJ:** los tres UJ tienen protagonista nombrado con contexto inline. OK.
- **Secciones requeridas:** presentes y excedidas para el stake (Visión, Usuario/JTBD, Glosario, Features/FR, No-Goals, Alcance MVP, SM + counter-metrics, Open Questions, Índice de supuestos, Precondiciones, GTM, Riesgos/competencia/foso, Why Now, Dependencias, Monetización, Gobernanza, NFRs).
- **Referencias H-*:** apuntan a artefacto externo (review gate); ver hallazgo de Downstream usability.

---

## Archivos de revisores

- Rúbrica: `_bmad-output/planning-artifacts/prds/prd-MetodoBMAD-2026-06-27/review-rubric.md` (v2.1)
- Adversarial: `_bmad-output/planning-artifacts/prds/prd-MetodoBMAD-2026-06-27/review-adversarial-general.md` (v2.1)
- Gemelo HTML: `_bmad-output/planning-artifacts/prds/prd-MetodoBMAD-2026-06-27/validation-report.html`
