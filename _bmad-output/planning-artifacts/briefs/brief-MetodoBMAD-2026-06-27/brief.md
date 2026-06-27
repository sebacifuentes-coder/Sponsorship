---
title: "Product Brief — Copiloto de Patrocinio Deportivo"
status: ready
created: 2026-06-27
updated: 2026-06-27
aligned_with: "PRD v2.4 (../../prds/prd-MetodoBMAD-2026-06-27/prd.md)"
source: ../../../brainstorming/brainstorm-patrocinio-valor-datos-ia-2026-06-27/brainstorm-intent.md
---

# Product Brief: Copiloto de Patrocinio Deportivo

> Nombre de trabajo; el comercial está por definir. **Este brief es el resumen ejecutivo; el detalle accionable y los requisitos viven en el PRD v2.4.** Se mantiene alineado con él.

## Resumen ejecutivo

El patrocinio deportivo está cambiando de eje: de **visibilidad** a **eficiencia y efectividad demostrable**. Los CFOs exigen a los CMOs probar con datos cómo el patrocinio impacta el crecimiento del negocio, y la IA generativa por fin lo hace posible. La pieza que falta no es solo tecnología: es ensamblar la **captura de datos** con su **explotación inteligente**, lograr adopción temprana y construir una **metodología de atribución defendible** ante un CFO escéptico.

Este producto es ese puente: un **copiloto** que ayuda al CMO de la marca patrocinadora a **explotar las oportunidades del patrocinio para maximizar el ROI** y, como evidencia, a **demostrar su impacto ante el board**. No es un medidor: medir es el soporte. Se entrega como una **capa de inteligencia y orquestación** sobre el stack que entidad y marca ya tienen (Salesforce, Adobe, Azure, Google y sus LLMs), no como un silo nuevo.

Lo construye un consultor para la **entidad deportiva**, que lo disponibiliza a sus marcas. Para la entidad es la palanca de **renovación y mejores primas**; para el CMO, la herramienta para **quedar como héroe**. Mercado inicial: **fútbol, clubes de LaLiga (España)**.

## El problema

El CMO no puede demostrar el impacto del patrocinio porque falta trazabilidad que conecte la visibilidad con la atribución en ventas. Esa trazabilidad no existe porque medir branding→venta es intrínsecamente complejo, y hoy se sustituye por proxies sobre supuestos (lógica AVE) — justo lo que el CFO ya no acepta. La muleta actual del CMO es, a la vez, su exposición.

**Segundo dolor (operativo):** activar los derechos es **lento**. La marca depende de su agencia (crea, el cliente aprueba, la agencia implementa); las idas y vueltas pierden tiempo y ventanas de oportunidad. No es solo *qué* activar, sino *qué tan rápido*.

## La solución

Un copiloto que, con los datos servidos sin pedirle al CMO que cargue nada:

1. **Identifica oportunidades** de activación a partir de **datos públicos del hincha** (qué busca, consume, opina y su narrativa social, agregados/anonimizados) y, cuando esté disponible, el first-party del fan vía clean room.
2. **Genera la activación** con IA y **acelera la aprobación**, comprimiendo el ciclo marca-agencia.
3. **Habilita la autonomía de implementación** (self-serve): la agencia sale del loop donde el cliente puede implementar solo.
4. **Demuestra el impacto** con datos para la escena clave: el CMO ante el board.

Estrella polar: *el mensaje correcto, en el momento correcto, de la forma correcta, a la persona correcta*. Las señales del hincha mapean a ella: búsqueda → momento, consumo → forma/canal, opinión/narrativa → mensaje.

## Qué lo hace diferente

- **Ataca dos dolores con una palanca (IA generativa):** demostrar/maximizar ROI **y** comprimir el ciclo de activación.
- **Valor en minutos (TTFV < 10 min):** primer valor genuino sobre datos públicos del club y del hincha, sin esperar a la integración profunda. Es también argumento de venta.
- **Cero carga de datos al CMO:** la data se sirve desde la propiedad, que tiene datos y derechos.
- **Incentivos alineados (precio por valor):** no es suscripción SaaS; el cliente paga cuando la herramienta certifica **valor medible**. Argumento difícil de rebatir ante el CFO.
- **Se monta sobre el stack existente** (orquesta, no reemplaza), bajando la barrera de adopción.
- **Foso a construir:** metodología de atribución certificada + dato propietario de benchmark cross-propiedad + lock-in de dos lados. (No basta "llegar primero".)

## A quién sirve

- **Entidad deportiva / Propiedad (cliente que paga y distribuye).** Posee datos del fan + derechos. Busca renovaciones y mejores primas.
- **Marca / CMO (usuario final).** Maximiza el ROI y queda como héroe ante el board.
- **Consultor (construye y provee).** Ingresos vía la consultora que lo contrata por identificación/desarrollo/captura de oportunidades; la plataforma es el habilitador del servicio. El cliente paga por **valor medible certificado**.

## Criterios de éxito

- **Principal (aprendizaje):** ≥4 clubes de LaLiga **probando el Copiloto y dando feedback**, aunque no haya venta; + ≥1 club que comprometa datos reales para un piloto.
- **Señal de negocio:** ≥1 cliente firma compromiso de **precio por valor** (sujeto a auditoría).
- **TTFV:** primer valor en < 10 min y ≤ 3 pasos.
- Secundarias (a validar): ciclo de activación reducido; nº de eventos de valor certificado; ≥1 renovación/mejora de prima atribuible.

## Alcance (resumen; detalle en el PRD)

**Fase 0 — Demo/PoC** con datos de muestra, exponiendo honestamente los pre-requisitos, para abrir puertas. **Fase 1 — Piloto acotado** sobre 1 club LaLiga + 1 marca (idealmente sponsor de ciclo corto **legal** — e-commerce/delivery/consumo/fintech; apuestas quedan fuera por RD 958/2020), para **validar la metodología de atribución sin facturar** (cobro desacoplado, se activa tras auditoría).

**Fuera (v1):** cobro automático (gated tras auditoría), atribución econométrica avanzada (v2), multi-deporte/multi-liga a escala, marketplace de activaciones, reemplazo total de la agencia.

## Valor medible en dos niveles

Como los sponsors de LaLiga abarcan ambos ciclos de compra: **Nivel 1 — trazabilidad dura** (ciclo corto: cupón/UTM/QR, indiscutible y cobrable) y **Nivel 2 — proxy/incrementalidad acordada** (ciclo largo: lift de marca, búsquedas, leads; requiere validar el estándar de evidencia con un CFO antes de cobrar).

## Contexto tecnológico y gobernanza

Capa de inteligencia/orquestación sobre Salesforce, Adobe, Azure, Google y sus LLMs. **Jurisdicción: GDPR (España/UE).** Dos tratamientos de dato: first-party PII del fan vía **clean room** (sin exponer PII a la marca; dictamen legal es gate de Fase 1); datos públicos del hincha **agregados/anonimizados** para el primer valor.

## Visión

En 2-3 años, el estándar por el cual una entidad deportiva demuestra y entrega valor de negocio a sus patrocinadores, y por el cual un CMO justifica y multiplica su inversión — convirtiendo el patrocinio de gasto de visibilidad en motor de crecimiento medible y accionable. **[SUPUESTO]**

## Precondiciones y decisiones abiertas (gestionadas en el PRD)

Decididas: mercado (LaLiga), ICP dual con beachhead de ciclo corto legal, cobro desacoplado del piloto, integración sigue al piloto (default Salesforce, LLM del proveedor), foso = metodología + benchmark. Precondiciones de Fase 1 (acciones reales, §10 del PRD): term sheet con una propiedad (P-1), estándar de evidencia validado con un CFO (P-2), diagnóstico de madurez de datos + base legal GDPR (P-4), go-to-market (P-5).
