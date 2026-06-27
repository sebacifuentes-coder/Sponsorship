# Revisión de Calidad del PRD — Copiloto de Patrocinio Deportivo (v2.1)

> Re-validación. La v1 obtuvo grade **Fair**. Esta revisión evalúa la v2.1 contra la rúbrica de 7 dimensiones de BMAD, considerando que es **chain-top** (alimenta UX → arquitectura → épicas).

## Veredicto general

Este PRD es **bueno y listo para alimentar el chain con gates**. Sostiene una tesis nítida (visibilidad → efectividad demostrable), trata sus tensiones más peligrosas con honestidad inusual (sobre-atribución del lado del vendedor, el ciclo largo de los sponsors de LaLiga, la agencia como bloqueador, el choque TTFV↔integración enterprise) y las convierte en mecanismos verificables (FR-12, SM-C1, precondiciones P-1..P-5, registro de riesgos R-1..R-9). El riesgo residual no está en la calidad del documento sino en que varios gates duros (P-1, P-2, P-4, P-5) siguen abiertos por diseño: el PRD lo declara explícitamente y prohíbe avanzar a construcción sin cerrarlos, lo cual es la decisión correcta. Lo que aún es thin es la cuantificación del go-to-market y de varios targets de métricas, todo marcado como `[DECISIÓN PENDIENTE]` o `[SUPUESTO]`, de modo que ningún downstream lo tomará como dato firme.

**Mejora respecto a la v1 (Fair): sí, clara y sustantiva.** La v1 cargaba como "supuestos" los riesgos que ahora son precondiciones con dueño, tenía un único "Valor medible" indefendible para ciclo largo (hoy dos niveles), no tenía control sobre el sesgo del vendedor (hoy FR-12 + SM-C1 duro), no separaba cobro de piloto (hoy desacoplado), no fijaba mercado/jurisdicción (hoy LaLiga/GDPR), no tenía go-to-market, ni riesgos/competencia/foso, ni la restricción de TTFV con su arquitectura de doble camino. El salto cualitativo es de **Fair a Good**.

---

## 1. Decision-readiness — **strong**

El PRD se lee como un documento que toma decisiones, no que las difiere a "consideraciones". El mercado está **decidido** ("Mercado inicial — fútbol, clubes de LALIGA (España). Decidido.", §2.2) y eso fija jurisdicción GDPR (§16). El desacople cobro↔piloto es una decisión declarada como cambio de alcance, no escondida ("el disparo de cobro automático se desacopla de Fase 1", FR-11).

Los trade-offs se nombran con lo que se sacrifica, no solo lo que se elige. El más fuerte es el reconocimiento explícito de la tensión del modelo de negocio en §15: "un modelo 'por valor' crea presión a **sobre-atribuir del lado del vendedor**, no solo a disputar del lado del comprador". Pocos PRDs admiten que su propio modelo de monetización incentiva el fraude del autor. El choque arquitectónico también es honesto: "el TTFV en minutos choca con la complejidad de integrar el stack enterprise + clean room... Es la tensión técnica central del MVP" (R-9).

Las Preguntas Abiertas (§8) son genuinamente abiertas (estándar de evidencia de Nivel 2, reparto de valor, modelo de cobro híbrido) y se distinguen de las ya decididas, listadas aparte. Los `[NOTE FOR PM]` están en tensiones reales (estándar de evidencia de Nivel 2 en §4.6; marketplace emocionalmente importante en §6.2), no en checkpoints seguros.

### Hallazgos
- **bajo** Beachhead aún pendiente (§2.2) — la recomendación de empezar por sponsor de ciclo corto es la decisión más consecuente del plan de validación y sigue como `[DECISIÓN PENDIENTE — Seba]`. Está bien señalado, pero conviene cerrarlo antes de épicas porque cambia qué se construye/prueba primero. *Fix:* convertir en P-6 o anexarlo a P-1 con fecha.

---

## 2. Substance over theater — **strong**

Nada se lee como mobiliario. Las **personas** son tres, todas con protagonista nombrado, y cada una **maneja una decisión** del PRD: Laura (CMO ciclo corto) ancla la trazabilidad dura de Nivel 1 y el edge case de no-cobro; Marco (director comercial) ancla FR-9 y el flujo de disputa; Seba (consultor) ancla la vista multi-cliente y el reuso de casos. No hay relleno de "cuarta persona para parecer exhaustivo".

La **innovación** no se reclama vacía: el §13 Why Now y §12 Foso admiten que el foso "hoy [está] ausente" y lo plantean como activo a construir, no como diferenciación inventada por plantilla. Eso es lo contrario del teatro de innovación.

Los **NFR** tienen umbrales específicos del producto, no boilerplate: TTFV < 10 min con justificación de diseño ("si tarda horas, es un fracaso", §17), cero carga de datos del fan al CMO como restricción verificable (SM-C2), PII confinada al clean room. La seguridad sí lista elementos algo estándar (TLS, cifrado en reposo, RBAC) pero anclados a GDPR concreto, no genéricos.

La **Visión** (§1) es específica de esta categoría: el eje CFO-exige-prueba / CMO-quiere-ser-héroe no swappea a cualquier PRD.

### Hallazgos
Ninguno material.

---

## 3. Strategic coherence — **strong**

Hay una tesis explícita y el PRD apuesta por ella: el patrocinio pasa de visibilidad a "eficiencia y efectividad demostrable", y "la pieza que falta... es ensamblar la captura de datos con su explotación inteligente... y una metodología de atribución defendible que un CFO escéptico acepte" (§1). Las features sirven ese arco: el subsistema central declarado más sensible es la Metodología de atribución (§4.6), no un set de features de conveniencia.

La priorización **sigue de la tesis**, no de lo fácil: el beachhead de ciclo corto se elige porque "el valor es indiscutible" y "valida el modelo antes de enfrentar la atribución más difícil" (§2.2). La fase 1 prioriza validar la metodología, no facturar ("Objetivo: validar la metodología... no facturar", §6.1).

Las **Success Metrics validan la tesis**, no actividad vacía: SM-1 mide adopción para aprendizaje (no DAU/MAU), SM-3 mide valor certificado y auditado. Las **counter-metrics existen y son duras**: SM-C1 (sobre-atribución, con metodología inmutable post-firma + muestreo obligatorio + penalización contractual) y SM-C2 (carga sobre CMO = cero). El kind de MVP es coherente (problem-solving/revenue con lógica de fases que matchea).

### Hallazgos
- **bajo** SM-1 mezcla métrica de aprendizaje con meta de conversión (§7) — "4 clubes probando" más "≥1 club que comprometa datos reales" son dos cosas; está bien explicado pero el doble objetivo dentro de una sola SM puede confundir downstream. *Fix:* desdoblar en SM-1a (uso/aprendizaje) y SM-1b (conversión a piloto profundo).

---

## 4. Done-ness clarity — **adequate**

Esta es la dimensión que más cargará la creación de historias, y el PRD es desigual aquí: la mayoría de FR tiene una "Consecuencia (testable)" con condición verificable, lo cual es exactamente lo que pide la rúbrica. Buenos ejemplos: FR-2 ("ningún registro con PII del fan sale del clean room hacia la Marca"), FR-10 ("solo se marca 'Valor medible' si la conversión es trazable según la metodología vigente; cada certificación queda registrada, versionada y auditable"), FR-12 ("un evento puede marcarse 'en disputa'; la resolución queda registrada; quien certifica no es el único que valida").

Pero hay adjetivos no acotados en consecuencias clave. FR-5: "≥1 variante lista para revisión **en minutos**" — "minutos" no es un bound (¿2? ¿15?). FR-14 dice "en minutos" y delega el número a SM-5 (< 10 min), lo cual es correcto, pero FR-5 no tiene su propio umbral pese a que el "Tiempo de generación" del §17 también dice solo "en minutos". El "nº de pasos acotado (objetivo: pocos)" de FR-14 es explícitamente no-numérico ("ver SM-5"), y SM-5 tampoco fija el máximo de pasos ("por debajo de un máximo acotado"), dejando un criterio testable sin valor.  FR-13 ("≥1 plataforma... y un proveedor de LLM") es claro.

### Hallazgos
- **medium** "Minutos" sin bound en generación (FR-5, §17 "Tiempo de generación") — es un criterio de done no testable; un ingeniero no sabe si 9 min cumple. *Fix:* fijar umbral numérico (p. ej. ≤ N min) o referenciar un NFR con número, como hace FR-14 con SM-5.
- **medium** "Máximo acotado" de pasos sin número (FR-14, SM-5) — el segundo criterio de SM-5 (nº de pasos) no tiene valor concreto, así que no es verificable. *Fix:* fijar máximo de pasos hasta primer valor (p. ej. ≤ 3 pasos).
- **bajo** FR-1 estado "conectada/error" no cubre estados intermedios (parcial, autenticando) — menor, pero la enumeración cerrada puede quedar corta. *Fix:* permitir estado "en progreso" o aclarar que es binario a propósito.

---

## 5. Scope honesty — **strong**

Las omisiones son explícitas y trabajan. §5 No-Goals es sustantivo y desambigua riesgos reales: "No es un SaaS por suscripción", "No reclama atribución causal econométrica 'perfecta' en v1", "No transfiere PII cruda del fan a la Marca". §6.2 Fuera del MVP marca cada exclusión con razón y horizonte ("Cobro automático — gated tras auditoría", "Atribución incremental avanzada — v2", "Cobro sobre Nivel 2... no se factura hasta [P-2]"). El de-scoping del cobro está propuesto honestamente como cambio declarado, no hecho en silencio.

Los `[ASSUMPTION]` están en inferencias reales (acceso/base legal en FR-1/§4.1; targets de métricas en §7) y **roundtrip al Índice de supuestos** (§9). Los `[NOTE FOR PM]` están en tensiones diferidas. Las precondiciones P-1..P-5 (§10) son el mejor mecanismo del documento: cada gate tiene dueño y resuelve un hallazgo nombrado (H-1, H-5/6, H-7/8, H-9).

**Densidad de open-items vs. stakes:** alta pero apropiada. El PRD **no se presenta como green-light-to-build**; al contrario, §10 dice "no avanzar a construcción de Fase 1 sin cerrar estos gates". En un PRD que se declara explícitamente gated, la alta densidad de pendientes es coherencia, no bloqueo.

### Hallazgos
- **bajo** §11 Go-to-Market es todo `[DECISIÓN PENDIENTE]` (§11) — honesto (no se inventan números), pero P-5 depende de esta sección y queda como esqueleto. No es deshonestidad de alcance; es trabajo sin hacer correctamente señalado. *Fix:* poblar antes de comprometer SM-1, como ya exige P-5.

---

## 6. Downstream usability — **strong**

Como chain-top, esta dimensión pesa, y el PRD la sirve bien. **Glosario presente** (§3) y los sustantivos de dominio se usan idénticos en FR/UJ/SM: "Propiedad", "Marca patrocinadora", "Valor medible", "Clean room", "Metodología de atribución" aparecen consistentes. El Glosario incluso fija el alias canónico ("Propiedad... *Alias: 'Entidad deportiva'*").

**IDs contiguos, únicos y resolubles:** FR-1..FR-14 sin huecos; SM-1..SM-5 + SM-C1/C2; UJ-1..UJ-3; P-1..P-5; R-1..R-9. Las cross-refs resuelven (FR-12 ↔ SM-C1 ↔ §15; §17 TTFV ↔ §14 ↔ R-9 ↔ FR-14 ↔ SM-5 forman una cadena trazable completa). Cada feature declara qué UJ realiza ("Realiza UJ-1, UJ-3"), lo que da trazabilidad feature→journey lista para extraer.

Cada sección se sostiene sola: las referencias son por término de Glosario o por ID, no por "ver arriba". **UJs con protagonista nombrado** que carga contexto inline (Laura/Marco/Seba), sin UJs flotantes.

### Hallazgos
- **bajo** Hallazgos H-1..H-16 referenciados sin índice local (varias secciones) — el PRD cita "resuelve H-2", "H-15", "H-16", etc., pero esos IDs viven en el review adversarial externo, no en el PRD. Un downstream que solo lea este doc no puede resolverlos. *Fix:* nota al pie indicando que H-* refiere al review gate, o tabla breve de mapeo. (Mecánico; no afecta la utilidad de los FR.)

---

## 7. Shape fit — **strong**

El shape matchea el producto. Es un **B2B multi-stakeholder con UX significativa** (CMO de la Marca + director de la Propiedad + consultor), y por eso los UJs con protagonista son load-bearing — y están. No está sobre-formalizado (no hay densidad de UJ artificial para un operador único) ni sub-formalizado (no es un producto de consumo sin UJs).

La capa **regulatoria** se trata con la seriedad que el shape exige: la trazabilidad de la restricción GDPR es explícita (§16 Gobernanza + §17 Seguridad + P-4 como gate), apropiado para un producto cuyo cuello de botella es base legal de datos del fan. La naturaleza **chain-top** está reconocida y servida (downstream usability fuerte, gates antes de arquitectura/épicas en §10). El producto es greenfield, así que no aplica la verificación brownfield.

### Hallazgos
Ninguno.

---

## Notas mecánicas

- **Glossary drift:** no detectado de forma material. "Entidad deportiva" se usa como alias declarado de "Propiedad" (Glosario lo autoriza). "Valor medible (v1)" en Glosario define solo Nivel 1, mientras §4.6 lo expande a dos niveles — leve desincronía: la entrada del Glosario quedó en la definición v1 conservadora y no menciona el Nivel 2. *Fix menor:* actualizar la entrada del Glosario para referenciar los dos niveles de §4.6.
- **ID continuity:** FR-1..FR-14 contiguos; SM, UJ, P, R sin huecos ni duplicados. OK.
- **Assumptions roundtrip:** los `[ASSUMPTION]` inline aparecen en el Índice (§9) y viceversa; varios se elevan correctamente a precondiciones (P-1, P-2, P-4). OK.
- **UJ protagonist naming:** los tres UJ tienen protagonista nombrado con contexto inline. OK.
- **Secciones requeridas:** presentes y excedidas para el stake (Visión, Usuario/JTBD, Glosario, Features/FR, No-Goals, Alcance MVP, SM + counter-metrics, Open Questions, Índice de supuestos, Precondiciones, GTM, Riesgos/competencia/foso, Why Now, Dependencias, Monetización, Gobernanza, NFRs).
- **Referencias H-\*:** apuntan a artefacto externo (review gate); ver hallazgo de §6.

---

## Resumen de severidad

| Severidad | Conteo |
|-----------|--------|
| Critical  | 0 |
| High      | 0 |
| Medium    | 2 |
| Low/Bajo  | 6 |

Los dos **medium** son de la dimensión Done-ness ("minutos" sin bound en FR-5/§17; "máximo acotado" de pasos sin número en FR-14/SM-5) y son fácilmente corregibles antes de épicas. Ningún hallazgo critical ni high.
