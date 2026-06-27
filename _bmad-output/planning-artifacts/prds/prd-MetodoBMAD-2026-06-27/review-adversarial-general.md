# Review adversarial general — PRD "Copiloto de Patrocinio Deportivo" v2.1

**Revisor:** subagente adversarial (segunda pasada)
**Fecha:** 2026-06-27
**Objeto:** prd.md, revision v2.1 (LaLiga + ICP dual)
**Postura:** adversarial. No valido de oficio. Una "mitigación" que solo mueve el problema a una precondición sin resolverlo NO cuenta como resuelta.

---

## Veredicto adversarial

La v2.1 hizo un trabajo cosmético honesto: nombró los riesgos, los etiquetó y los empujó a §10/§12. Pero **nombrar un riesgo no es mitigarlo**. La mayoría de los críticos previos siguen abiertos, solo que ahora con una etiqueta de "precondición" o "`[DECISIÓN PENDIENTE]`" encima. Peor: la decisión de mercado (LaLiga, sponsors de ciclo largo) **agrava** el problema central de cobrabilidad en vez de resolverlo, y la nueva restricción TTFV <10 min introduce una **contradicción interna dura** con la propia tesis de valor del producto. El PRD es más honesto que la v2, pero no más viable. **Sigue siendo un documento que describe un negocio cuyas dos premisas fundacionales —cobrar por valor atribuible y entregar valor en 10 minutos— están sin probar y, en parte, en tensión mutua.**

---

## 1. Verificación de hallazgos críticos/altos previos

### H-1 (crítico) — Cobro sin contrato ni marco legal
**Estado: PARCIALMENTE MITIGADO (declarativo).**
La v2.1 crea P-1 (term sheet / contrato marco). Bien. Pero P-1 es una precondición **vacía**: dice "hay que firmar un contrato que defina qué es valor, quién audita y qué pasa en disputa" — es decir, lista las preguntas difíciles y las pospone. No hay borrador de cláusulas, ni estructura de reparto, ni mecanismo de árbitro nombrado. Mover "no tenemos contrato" a "precondición: tener contrato" no resuelve nada; solo lo hace explícito. **Sigue abierto en sustancia.** Además, FR-11 desacopla el cobro del piloto, lo que reduce el riesgo en Fase 1 — pero eso significa que el modelo de negocio **nunca se prueba en el piloto**. El piloto valida la herramienta, no el negocio.

### H-2 (crítico) — Certificación juez y parte, sin árbitro
**Estado: MITIGADO EN DISEÑO, no en realidad.**
FR-12 (nuevo) introduce auditoría por tercero/rol independiente y flujo de disputa. Es la mejor respuesta del documento. Pero "tercero/rol independiente" no está especificado: ¿quién es ese tercero? ¿Un auditor externo pagado por quién? ¿Un rol interno de la consultora (que sigue siendo juez y parte con otro sombrero)? Si el "tercero independiente" lo paga y lo elige el vendedor, no es independiente. **Mitigado a nivel de requisito; abierto a nivel de gobernanza real.**

### H-3 (alto) — Incentivo a inflar el valor del lado del vendedor
**Estado: MITIGADO (el mejor caso del PRD).**
§15 reconoce explícitamente la presión a sobre-atribuir del lado del vendedor (no solo del comprador), SM-C1 pasa a control duro (metodología inmutable post-firma, muestreo obligatorio, penalización contractual) y FR-12 hace el muestreo trazable. Esto sí ataca el incentivo perverso. **Reserva adversarial:** la "penalización contractual por sobre-atribución" vive en un contrato que aún no existe (P-1). La mitigación es tan real como P-1, que no está cerrada. Pero el reconocimiento conceptual es sólido.

### H-4 (alto) — Ciclo de venta largo
**Estado: AGRAVADO por la decisión de mercado.**
Elegir LaLiga con sponsors de ciclo largo (aerolíneas, banca, autos, telco) significa que la venta a la marca, la firma de metodología y la materialización del valor son TODAS lentas. R-4 lo reconoce y sube a ALTO. La "mitigación" (beachhead de ciclo corto) es razonable pero **no está decidida** (`[DECISIÓN PENDIENTE]`) y choca con que los sponsors de ciclo corto (apuestas/iGaming) en España están bajo **fortísima restricción regulatoria** (Real Decreto 958/2020 prohíbe casi toda la publicidad y patrocinio de apuestas en fútbol español desde 2021). El beachhead recomendado es justo el segmento con más fricción legal en LaLiga. **Abierto y, en parte, internamente contradictorio.** (Ver H-NUEVO-1.)

### H-5 (crítico) — Círculo vicioso de atribución cobrable
**Estado: ABIERTO. El núcleo del problema sigue intacto.**
El círculo era: para cobrar por valor necesito atribución defendible; la atribución defendible necesita datos+metodología+CFO que la acepte; nada de eso existe todavía. La v2.1 responde con: Nivel 1 (trazabilidad dura, cobrable) y Nivel 2 (proxy, no cobrable hasta validar con CFO). Esto **no rompe el círculo, lo segmenta**:
- Nivel 1 es genuinamente cobrable PERO solo aplica a ciclo corto (cupón/UTM/QR), que es la minoría de los sponsors de LaLiga y el segmento con problema regulatorio.
- Nivel 2 (la mayoría del dinero de LaLiga) sigue exactamente en el círculo vicioso: "es cobrable... después de que un CFO valide el estándar de evidencia (P-2)". Eso es el círculo, con nombre nuevo.

**Veredicto: el círculo vicioso sigue vivo para el grueso del mercado elegido.** La v2.1 lo encapsuló en P-2 en lugar de resolverlo. (Ver §2, pregunta del cliente.)

### H-6 (alto, ligado a H-5) — "Atribución suficiente" no resiste a un CFO escéptico
**Estado: ABIERTO (movido a P-2).**
R-2 + P-2 lo reconocen. Pero P-2 es "validar el estándar con un CFO real antes de cobrar" — de nuevo, la solución es la precondición. Hasta que un CFO real firme, el riesgo probatorio está intacto. Honesto al admitirlo, no resuelto.

### H-7 (crítico) — Dependencia de datos + derechos de la Propiedad
**Estado: PARCIALMENTE MITIGADO (declarativo + dependiente de terceros).**
P-4 (diagnóstico de madurez + base legal GDPR + diseño clean room) es la respuesta correcta en estructura. Pero: (a) depende de que clubes de LaLiga concretos tengan madurez de datos suficiente — no demostrado, solo "se evalúa"; (b) el clean room se invoca como bala de plata legal repetidamente (§16, glosario, FR-2) sin diseño técnico ni dictamen legal; (c) §16 admite que el consentimiento del fan al club **no se extiende a la Marca** bajo GDPR — esto es un riesgo legal de fondo que el clean room *mitiga pero no necesariamente resuelve* (la activación sobre segmentos modelados también es tratamiento de datos). **Abierto; el clean room está sobrecargado como solución mágica.**

### H-8 (alto) — Base legal GDPR
**Estado: ABIERTO (movido a P-4).** Reconocido como gate, sin dictamen. Igual que H-6: la mitigación es la precondición.

### H-9 (alto) — SM-1 sin go-to-market
**Estado: PARCIALMENTE MITIGADO (esqueleto vacío).**
§11 (nuevo) crea una sección de Go-to-Market. Pero su contenido es íntegramente `[DECISIÓN PENDIENTE — Seba: completar con datos reales]`: pipeline nominal (vacío), relaciones (vacío), quién vende (vacío), embudo (vacío). Es un **formulario en blanco**, no un GTM. SM-1 pide "4 clubes de LaLiga probando" sin una sola Propiedad nombrada ni un contacto real. **Abierto.** Adicional: SM-1 se relajó de "venta" a "adopción para aprendizaje" — defendible, pero convierte la métrica primaria en una de actividad, no de negocio; nada en el PRD mide si el negocio funciona.

### H-10 (medio) — La demo vende lo que la Fase 1 no cumple
**Estado: MITIGADO.** Fase 0 ahora "expone honestamente los pre-requisitos como parte del pitch" y R-6 lo registra. Aceptable.

### H-11 (alto) — Agencia con poder de bloqueo del self-serve
**Estado: PARCIALMENTE MITIGADO.**
R-7 + nota en §4.4 + No-Goal reformulado: la agencia pasa de "desintermediada" a "posible canal/aliado". Reconocer que la agencia controla cuentas y canales es correcto. Pero la "mitigación" es "validar con CMOs reales y mapear control de accesos en el piloto" — otra vez, posponer a validación. Y hay tensión sin resolver: el JTBD del CMO (§2.1) es explícitamente "activar rápido **sin depender del ciclo lento con la agencia**", mientras §4.4 ahora dice que la agencia puede operar el canal. **El producto promete autonomía y a la vez admite que la agencia controla el grifo.** Contradicción no resuelta, solo señalada.

### H-12 (alto) — Sin foso defensivo
**Estado: ABIERTO (catalogado, no construido).**
§12 ahora lista 4 fosos candidatos (dato propietario cross-Propiedad, metodología certificada, lock-in de dos lados, velocidad de aprendizaje) y cierra con `[DECISIÓN PENDIENTE — Seba: elegir foso]`. Listar fosos posibles no es tener uno. R-8 admite que incumbentes con distribución (Salesforce/Adobe) o holdings (WPP/Publicis) pueden copiarlo, y que el producto **se monta sobre el stack de esos mismos incumbentes, dándoles visibilidad directa de la oportunidad**. Eso no es un foso ausente: es un foso negativo (le enseñas la jugada a quien puede aplastarte). **Abierto y subestimado.**

### H-13 / H-14 (deporte/región sin decidir)
**Estado: RESUELTO.** P-3 cerrada: LaLiga, España. Decisión tomada. (Aunque la decisión *crea* nuevos problemas — ver H-4, H-NUEVO-1.)

### H-15 / H-16 (medios, de la primera pasada)
**Estado: RESUELTOS.** H-15 (brief de negocio ≠ carga de datos) aclarado en FR-2 y SM-C2. H-16 (método de estimación transparente) resuelto en FR-4 (versionado, transparente). Correcto.

---

## 2. Análisis de lo NUEVO en v2.1 (foco solicitado)

### 2.1 ¿El Nivel 2 ("Valor medible" ciclo largo) es realmente cobrable, o sigue siendo el círculo vicioso?

**Veredicto adversarial: SIGUE SIENDO EL CÍRCULO VICIOSO, ahora con etiqueta.**

El razonamiento del PRD es: "como los sponsors de LaLiga son mayoritariamente de ciclo largo, necesitamos un Nivel 2 (proxy/incrementalidad)". Y luego: "el cobro de Nivel 2 puede requerir incrementalidad real, no solo proxy" y "validar con un CFO antes de cobrar (P-2)".

Desmontaje:
1. El dinero grande de LaLiga (aerolíneas, banca, autos, telco) vive en Nivel 2.
2. Nivel 2 no es cobrable hoy: depende de P-2 (validar estándar con CFO) y posiblemente de incrementalidad real (test/control, geo, holdouts), que el propio §6.2 pone **fuera del MVP (v2)**.
3. Por tanto: el MVP **no puede cobrar al grueso del mercado que eligió**, y la herramienta de incrementalidad que lo haría defendible está fuera de alcance.
4. Resultado: el producto v1 solo puede cobrar a Nivel 1 (ciclo corto), que en LaLiga es minoritario **y** regulatoriamente tóxico (apuestas, ver abajo).

Esto es exactamente el círculo de H-5: para cobrar al cliente real (ciclo largo) necesitas atribución que no tienes y que no construirás en v1. La segmentación en dos niveles es analíticamente honesta pero **comercialmente deja el producto sin un comprador cobrable real en su mercado elegido**. La elección de LaLiga no resuelve H-5; lo empeora, porque alinea el mercado primario con el nivel no cobrable.

### 2.2 ¿TTFV <10 min con arquitectura de doble camino es realista? ¿La ruta ligera da valor REAL o un demo vacío?

**Veredicto adversarial: LA RUTA LIGERA, COMO ESTÁ ESPECIFICADA, ROMPE LA PROMESA DE VALOR. Es la contradicción interna más grave de la v2.1.**

La tesis entera del producto (§1, §4) es: el valor proviene de (a) datos first-party del fan de ESTA Propiedad, servidos vía clean room, cruzados con (b) los derechos del patrocinio y (c) el brief de negocio de la Marca, para producir oportunidades atribuibles y certificables.

Ahora FR-14 / §4.8 / NFR TTFV exigen entregar "≥1 Oportunidad accionable + previsualización de Activación + vista de valor" en <10 minutos por una **"ruta ligera con datos semilla/muestra del club o conector mínimo"**, con la integración profunda (clean room + conectores) corriendo después en segundo plano.

El problema lógico:
- Si la oportunidad de los primeros 10 min se genera con **datos de muestra/semilla** (no los datos reales del fan de ese club), entonces **no es una oportunidad real ni atribuible** — es exactamente el demo de Fase 0 disfrazado de "primer valor". Rompe la promesa, porque el valor diferencial del producto ES la especificidad de los datos del fan. Una oportunidad genérica sobre datos sintéticos es lo que cualquier LLM hace gratis; ahí no hay foso ni valor cobrable.
- Si en cambio se generara con datos reales en <10 min, sería incompatible con todo el resto del PRD, que dice que acceder a esos datos requiere P-4 (madurez), base legal GDPR (P-4), diseño de clean room y consentimiento que no se extiende a la Marca. No puedes tener "datos reales del fan en 10 minutos" y "el acceso a datos del fan es un gate legal de Fase 1" a la vez.

Conclusión: **la ruta ligera o entrega un demo vacío (rompe la promesa de valor real) o viola las precondiciones legales/de datos del propio PRD (imposible en 10 min).** No hay tercera opción especificada. El PRD reconoce la tensión técnica (R-9, "tensión técnica central del MVP") pero la enmarca como un reto de *arquitectura*, cuando en realidad es un reto de *veracidad del valor*: el problema no es de ingeniería de latencia, es que no se puede dar valor *real y diferencial* sin los datos que tardan semanas y un dictamen legal en estar disponibles.

Además, el "<10 min" se justifica como "argumento de venta y de entrada" (SM-5, NFR). Eso revela el verdadero rol de la ruta ligera: es **marketing de onboarding**, no entrega de valor. Vender la velocidad como valor cuando el valor real llega semanas después es precisamente el tipo de promesa que R-6 advierte ("la demo vende lo que la Fase 1 no cumple"). La v2.1 cerró R-6 para la demo y lo reabrió por la puerta de atrás en FR-14.

---

## 3. Hallazgos NUEVOS introducidos por la v2.1

### H-NUEVO-1 (CRÍTICO) — El beachhead recomendado (apuestas/iGaming en LaLiga) está prohibido o severamente restringido en España
**Ubicación:** §2.2 (beachhead), §4.6 Nivel 1, §6.1 Fase 1.
**Problema:** el PRD recomienda probar primero con un sponsor de ciclo corto "apuestas/iGaming o e-commerce de un club LaLiga" por su trazabilidad dura. Pero el **Real Decreto 958/2020** de comunicación comercial de actividades de juego prohíbe desde 2021 el patrocinio de equipos de fútbol por casas de apuestas y restringe drásticamente su publicidad en España. El segmento "más cobrable" del PRD es, en su mercado elegido, el menos viable legalmente. e-commerce sigue siendo opción, pero el documento ancla el ejemplo en apuestas repetidamente.
**Arreglo:** eliminar apuestas/iGaming del beachhead recomendado para España; reanclar el ejemplo de ciclo corto en e-commerce/consumo/retail con conversión trazable; verificar con asesoría legal qué verticales de ciclo corto son patrocinadores activos y legales de clubes LaLiga hoy.

### H-NUEVO-2 (ALTO) — La métrica primaria (SM-1) ya no mide negocio, y nada lo sustituye
**Ubicación:** §7 SM-1.
**Problema:** SM-1 se redefinió a "4 clubes probando + feedback, aunque no haya venta cerrada" — métrica de actividad/aprendizaje. Defendible para validar adopción, pero ahora **ninguna métrica del PRD prueba que el modelo de negocio (precio por valor) funciona**: el cobro está desacoplado del piloto (FR-11), Nivel 2 no es cobrable (P-2), SM-3 cuenta eventos certificados pero "sin cobro", SM-4 (renovación) es "≥1 caso" aspiracional. El PRD puede "tener éxito" en todas sus métricas y aun así no haber demostrado que alguien paga. **El éxito definido es ortogonal a la viabilidad comercial.**
**Arreglo:** añadir una métrica de validación comercial real (p. ej. ≥1 cliente que firme un term sheet con disposición a pagar sobre Nivel 1 verificado, o un test de precio con CFO), separada de la adopción para aprendizaje.

### H-NUEVO-3 (ALTO) — El piloto valida la herramienta pero deja el negocio sin probar
**Ubicación:** §6.1 Fase 1 + FR-11 (cobro desacoplado).
**Problema:** al desacoplar el cobro del piloto (mitigación legítima de H-1/H-2), la Fase 1 prueba que la herramienta genera oportunidades y certifica valor, pero **no prueba la única hipótesis que mata el negocio si es falsa: que un cliente pague por ese valor certificado**. Se difiere el momento de la verdad a "una fase posterior, tras auditoría de metodología" — fase que no está planificada ni datada. Riesgo de construir todo el aparato y descubrir la inviabilidad comercial al final.
**Arreglo:** definir explícitamente una Fase 1.5 / criterio de salida que ponga a prueba la disposición a pagar (aunque sea un cobro simbólico o un compromiso contractual de pago condicionado) antes de invertir en escalar.

### H-NUEVO-4 (MEDIO) — El clean room se invoca como solución legal universal sin diseño ni dictamen
**Ubicación:** glosario, FR-2, §16, R-3.
**Problema:** "clean room" aparece como la respuesta a base legal, consentimiento, residencia, retención y a "no transferir PII a la Marca". §16 admite que el consentimiento al club no se extiende a la Marca, pero asume que el clean room resuelve eso. Activar sobre segmentos modelados sigue siendo tratamiento de datos bajo GDPR y requiere base legal propia; el clean room reduce exposición de PII pero no crea por sí solo la base de legitimación. Se está cargando un patrón técnico con una conclusión jurídica no validada.
**Arreglo:** P-4 debe exigir dictamen legal específico sobre si la activación vía clean room constituye base legal suficiente para el uso por la Marca, no asumirlo. Bajar el tono de las afirmaciones del glosario/§16 de "mitiga/resuelve" a "diseño a validar legalmente".

### H-NUEVO-5 (MEDIO) — Acumulación de `[DECISIÓN PENDIENTE]` críticas: el PRD no es accionable como gate
**Ubicación:** transversal (§2.2, FR-11, §11 íntegra, §12 foso, P-1..P-5).
**Problema:** las decisiones que determinan viabilidad —beachhead, desacople de cobro, GTM completo, foso, reparto de valor, estándar de evidencia— están TODAS pendientes. Un PRD que pasa el gate de revisión con sus cinco palancas de viabilidad sin decidir no es un PRD listo para arquitectura/épicas; es un brief de decisiones pendientes. El riesgo es que los workflows posteriores (UX, arquitectura) arranquen sobre fundaciones que aún pueden cambiar de raíz (p. ej. si el beachhead cambia, cambia el modelo de atribución; si el foso cambia, cambia la arquitectura de datos).
**Arreglo:** marcar explícitamente que NINGÚN workflow posterior arranca hasta cerrar P-1, P-2, P-4 y el beachhead. El propio PRD lo sugiere en §10 ("no avanzar sin cerrar gates") pero no lo hace condición dura ni bloquea el avance.

### H-NUEVO-6 (BAJO) — Contradicción de framing CMO vs. agencia sin reconciliar
**Ubicación:** §2.1 (JTBD: activar "sin depender del ciclo lento con la agencia") vs. §4.4/R-7 (la agencia puede operar el canal).
**Problema:** ya señalado en H-11; lo registro como hallazgo nuevo de coherencia porque la v2.1 introdujo la nota de §4.4 sin reconciliarla con el JTBD que la contradice. El valor prometido al CMO (autonomía) y la realidad admitida (agencia controla el canal) coexisten sin resolución.
**Arreglo:** decidir y declarar el modelo: o el producto entrega autonomía real (y entonces necesita acceso a canales que no pasen por la agencia), o reposiciona el beneficio del CMO de "autonomía" a "velocidad/calidad de la propuesta a la agencia". No ambos.

---

## 4. Tabla resumen de estado

| ID | Severidad orig. | Estado en v2.1 | Comentario |
|----|-----------------|----------------|------------|
| H-1 | crítico | Parcial (declarativo) | P-1 vacío; cobro desacoplado |
| H-2 | crítico | Mitigado en diseño | FR-12; "tercero" sin especificar |
| H-3 | alto | Mitigado | mejor respuesta del PRD; depende de P-1 |
| H-4 | alto | Agravado | LaLiga = ciclo largo; beachhead sin decidir |
| H-5 | crítico | **ABIERTO** | círculo vivo para Nivel 2 (grueso del mercado) |
| H-6 | alto | Abierto (en P-2) | mitigación = precondición |
| H-7 | crítico | Parcial (declarativo) | clean room sobrecargado |
| H-8 | alto | Abierto (en P-4) | sin dictamen legal |
| H-9 | alto | Parcial (vacío) | §11 es formulario en blanco |
| H-10 | medio | Mitigado | pre-requisitos honestos |
| H-11 | alto | Parcial | contradicción autonomía↔agencia |
| H-12 | alto | **ABIERTO** | fosos listados, no construidos; foso negativo |
| H-13/14 | — | Resuelto | LaLiga decidido |
| H-15/16 | medio | Resuelto | aclarados |

**Nuevos:** H-NUEVO-1 (crítico), H-NUEVO-2/3 (alto), H-NUEVO-4/5 (medio), H-NUEVO-6 (bajo).

---

## 5. Recuento

**Críticos previos (5): H-1, H-2, H-5, H-7** + el implícito de atribución (núcleo de H-5/H-6).
- Resueltos de verdad: 0
- Mitigados sustancialmente: 1 (H-2, en diseño)
- Parciales/declarativos: 2 (H-1, H-7)
- Abiertos: 1 (H-5, el núcleo)

**Altos previos (6): H-3, H-4, H-6, H-9, H-11, H-12.**
- Resueltos/mitigados: 1 (H-3)
- Parciales: 3 (H-9, H-11, y H-6 abierto-en-precondición)
- Abiertos/agravados: 2 (H-4 agravado, H-12 abierto)

**Nuevos hallazgos v2.1:** 1 crítico (beachhead apuestas ilegal/restringido), 2 altos (métrica sin negocio; piloto no prueba el negocio), 2 medios, 1 bajo.

---

## 6. Lo que el PRD debe cerrar antes de pasar a arquitectura (prioridad adversarial)

1. **Resolver H-5 para Nivel 2** o aceptar formalmente que v1 solo cobra Nivel 1 — y entonces verificar que existe un comprador Nivel 1 legal en LaLiga (no apuestas).
2. **Reescribir FR-14 / TTFV:** decidir si la ruta ligera entrega valor real (imposible en 10 min sin datos) o es onboarding/demo — y dejar de venderla como "primer valor". No prometer valor diferencial sobre datos de muestra.
3. **Corregir H-NUEVO-1:** sacar apuestas del beachhead español.
4. **Añadir métrica de disposición a pagar** (H-NUEVO-2/3): el piloto debe poner a prueba el negocio, no solo la herramienta.
5. **Llenar §11 GTM** con Propiedades y contactos reales, o bajar SM-1 a hipótesis no comprometida.
6. **Especificar el "tercero independiente"** de FR-12 y elegir el foso de §12: sin eso, H-2 y H-12 siguen abiertos.

---

*Fin del review adversarial v2.1.*
