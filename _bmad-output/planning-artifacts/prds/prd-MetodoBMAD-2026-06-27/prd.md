---
title: "Copiloto de Patrocinio Deportivo"
status: final
created: 2026-06-27
updated: 2026-06-27
revision: v2.4 (datos del hincha: intención, consumo, opinión, narrativa)
source_brief: ../../briefs/brief-MetodoBMAD-2026-06-27/brief.md
source_intent: ../../../brainstorming/brainstorm-patrocinio-valor-datos-ia-2026-06-27/brainstorm-intent.md
---

# PRD: Copiloto de Patrocinio Deportivo
*Título de trabajo — confirmar.*

> **Nota de revisión (status: final, v2.4):** este PRD pasó **dos rondas de reviewer gate** (rúbrica + adversarial). La rúbrica de calidad lo califica **Good**. Los riesgos críticos de negocio se elevaron de "supuestos" a **Precondiciones de Fase 1** (§10) y a un registro de **Riesgos** (§12). Tras el re-gate se corrigió el beachhead (apuestas → e-commerce/delivery/consumo/fintech, por RD 958/2020), se definió el primer valor genuino sin first-party (§4.8) y se añadió la señal de pago (SM-6). **Riesgos residuales aceptados para avanzar a Fase 3:** atribución cobrable del ciclo largo (gestionada en P-2) y defensibilidad/foso (a construir, §12). Las decisiones aún tuyas están marcadas `[DECISIÓN PENDIENTE — Seba]`.

## 0. Propósito del documento

Este PRD es para el PM (Seba/consultor), los stakeholders de la entidad deportiva y los dueños de los workflows posteriores (UX, arquitectura, épicas e historias). Se estructura con un Glosario que ancla el vocabulario, features agrupadas con requisitos funcionales (FR) numerados globalmente, supuestos etiquetados en línea e indexados, y —nuevo en v2— una sección de Precondiciones de Fase 1 y un registro de Riesgos. Parte del Product Brief (`status: ready`) y del intent doc del brainstorming; no los duplica.

## 1. Visión

El patrocinio deportivo pasa de **visibilidad** a **eficiencia y efectividad demostrable**. Los CFOs ya exigen a los CMOs probar con datos cómo el patrocinio impacta el negocio, y la IA generativa por fin lo hace posible. La pieza que falta no es solo tecnología: es ensamblar la **captura de datos** con su **explotación inteligente**, lograr adopción temprana y —crítico— construir una **metodología de atribución defendible** que un CFO escéptico acepte.

El Copiloto es esa pieza: una **capa de inteligencia y orquestación** —web app para el usuario + integración por detrás— que ayuda al CMO a **explotar las oportunidades del patrocinio para maximizar el ROI** y, como evidencia, a **demostrar su impacto ante el board**. Se monta sobre el stack que entidad y marca ya tienen (Salesforce, Adobe, Azure, Google y sus LLMs), sin pedirle al CMO que cargue datos del fan. Lo construye un consultor para la entidad deportiva, que lo disponibiliza a sus marcas: para la entidad es la palanca de **renovación y mejores primas**; para el CMO, la herramienta para **quedar como héroe**.

## 2. Usuario objetivo

### 2.1 Jobs To Be Done

- **CMO (emocional/social):** quedar como héroe ante el board demostrando, con datos, que el patrocinio fue palanca de crecimiento.
- **CMO (funcional):** maximizar el ROI del patrocinio explotando oportunidades de activación; activar rápido sin depender del ciclo lento con la agencia.
- **Entidad deportiva (negocio):** renovar patrocinios y mejorar primas demostrando valor entregado.
- **Consultor (operativo):** identificar, desarrollar y capturar oportunidades de forma escalable, apoyado en la herramienta.

### 2.2 Mercado, cliente ideal (ICP) y no-usuarios (v1)

**Mercado inicial — fútbol, clubes de LALIGA (España).** Decidido. La jurisdicción es España/UE (GDPR), lo que fija el régimen de gobernanza (§16).

**ICP — ambos ciclos de compra.** Los sponsors principales de LaLiga son mayoritariamente de **ciclo largo** (aerolíneas, banca, autos, telco), donde el patrocinio actúa sobre consideración/marca y el valor tarda meses; y existen también sponsors de **ciclo corto** (e-commerce, delivery, consumo, fintech) con conversión trazable rápido. El producto debe servir a ambos, lo que obliga a un **"Valor medible" de dos niveles** (§4.6).

> **Restricción legal (resuelve hallazgo del gate):** las **apuestas/iGaming** —el segmento de conversión más trazable— están **fuertemente restringidas como patrocinador en el fútbol español** (RD 958/2020: prohibición en camisetas y límites de publicidad). Por eso NO son el beachhead pese a su trazabilidad.

**Recomendación de beachhead (`[DECISIÓN PENDIENTE — Seba]`):** probar primero la metodología con un sponsor de **ciclo corto legal** (e-commerce, delivery, consumo o fintech de un club LaLiga), donde el valor es trazable e indiscutible, y extender a los de ciclo largo con métricas proxy/incrementalidad ya acordadas. Esto valida el modelo antes de enfrentar la atribución más difícil.

**No-usuarios (v1):**
- **Agencia creativa** como usuaria objetivo: el producto la desintermedia solo donde el cliente gana autonomía — y se evalúa posicionarla como aliado/canal (ver Riesgo R-7).
- **Clubes con madurez de datos insuficiente** para servir datos del fan de forma legal y usable (se evalúa con el diagnóstico de §10, P-4).

### 2.3 User Journeys clave

- **UJ-1. Laura, CMO de una marca patrocinadora, llega al board con la prueba.**
  - **Persona + contexto:** Laura es CMO de una marca de consumo (ciclo corto) que patrocina un club. Su CFO le pidió demostrar el impacto.
  - **Estado de entrada:** autenticada en la web app; los datos del fan ya están servidos desde la Propiedad vía clean room (ella no cargó nada); dejó un brief de negocio (objetivos, marca, calendario).
  - **Camino:** abre el dashboard → ve oportunidades priorizadas → elige una → el copiloto genera la creatividad → la aprueba → se implementa por un canal integrado.
  - **Clímax:** semanas después abre el panel de evidencia y obtiene un informe de impacto atribuible (vía conversiones trazables) listo para el board.
  - **Resolución:** presenta; la marca mantiene/amplía el patrocinio. **Edge case:** si la atribución no alcanza el umbral, el panel lo indica, no se reporta valor y no se dispara cobro.

- **UJ-2. Marco, director comercial de la entidad, usa la evidencia para renovar.**
  - **Persona + contexto:** Marco gestiona patrocinios del club y negocia renovaciones; rinde cuentas a su dirección sobre ingresos comerciales.
  - **Estado de entrada:** autenticado en la vista Entidad; el piloto con al menos una marca lleva semanas corriendo.
  - **Camino:** revisa el valor entregado por marca → filtra por periodo → exporta el caso de valor certificado.
  - **Clímax:** negocia una **prima mayor** mostrando ROI auditado, no promesas.
  - **Resolución:** patrocinio renovado en mejores términos. **Edge case:** si una marca disputa el valor, Marco accede al log de certificación y a la metodología pre-acordada para sostener la cifra.

- **UJ-3. Seba, consultor, identifica y captura oportunidades para varios clientes.**
  - **Persona + contexto:** Seba opera vía la consultora que lo contrata por identificación/desarrollo/captura de oportunidades.
  - **Estado de entrada:** autenticado con vista multi-cliente; metodología de atribución ya firmada con la entidad.
  - **Camino:** detecta oportunidades en la data del fan → arma activaciones → monitorea el valor capturado y certificado.
  - **Clímax:** entrega valor medible y auditable que sostiene su modelo de servicios.
  - **Resolución:** caso de éxito reutilizable para abrir la siguiente entidad. **Edge case:** si la metodología no certifica valor en una activación, queda como aprendizaje, no como cobro.

## 3. Glosario

- **Copiloto** — el producto: capa de inteligencia y orquestación (web app + integración).
- **Propiedad** — término canónico para el club, liga o federación que posee datos del fan y derechos de patrocinio; cliente que paga y distribuye el Copiloto. *(Alias: "Entidad deportiva".)*
- **Marca patrocinadora** — empresa que patrocina a la Propiedad; su CMO es el usuario final.
- **CMO** — responsable de marketing de la Marca; usuario principal.
- **Consultor** — tercero que construye/provee el Copiloto y opera el servicio vía la consultora.
- **Datos del fan (first-party)** — datos de audiencia con PII propiedad de la Propiedad; base de la precisión; requieren clean room + base legal GDPR.
- **Datos públicos del hincha** — señales públicas y agregadas de la afición, sin PII: sociodemografía, intereses y afinidades de marca, **y señales de intención y narrativa** (qué busca, qué consume, qué opina/sentimiento, su narrativa social pública). Usables para el primer valor sin clean room, manteniéndolas agregadas/anonimizadas.
- **Clean room** — entorno donde se activa sobre segmentos/audiencias modeladas **sin transferir PII cruda** del fan a la Marca.
- **Oportunidad de activación** — acción de marketing basada en datos del fan que explota los derechos del patrocinio para generar valor de negocio.
- **Activación** — la pieza ejecutada (creatividad/contenido) de una Oportunidad.
- **Data servida** — mecanismo por el cual los datos llegan al Copiloto desde la Propiedad sin carga para el CMO (vía clean room).
- **Metodología de atribución** — el conjunto de reglas pre-acordadas y firmadas (baseline, ventana, trazabilidad) que determina qué impacto se atribuye al patrocinio.
- **Valor medible (v1)** — impacto de negocio **directamente trazable** a una Activación (p. ej. conversiones con código/UTM/cupón) dentro de la ventana de atribución acordada. Certificado y auditable.
- **Precio por valor** — modelo de cobro: el cliente paga cuando se certifica Valor medible; no es suscripción SaaS.
- **Evidencia de ROI** — informe atribuible para el board, derivado del Valor medible.

## 4. Features

### 4.1 Servido de datos del fan vía clean room (Data servida)
**Descripción:** el Copiloto se conecta a las fuentes de la Propiedad y deja disponibles **segmentos/audiencias modeladas** para el resto del sistema, **sin transferir PII cruda a la Marca** y sin que el CMO cargue nada. Realiza UJ-1. `[ASSUMPTION: la Propiedad concede acceso y existe base legal para el uso por la Marca — ver §10]`

#### FR-1: Conectar fuentes de datos de la Propiedad
El Consultor/Entidad puede conectar las fuentes de Datos del fan al Copiloto.
**Consecuencias (testables):** tras conectar, el Copiloto lista fuentes y estado (conectada/error); el CMO no ejecuta ningún paso de carga.

#### FR-2: Servir datos al motor sin carga del CMO, vía clean room
El sistema sirve segmentos modelados al motor de oportunidades sin exponer PII a la Marca.
**Consecuencias (testables):** el dashboard del CMO muestra oportunidades sin input de datos del fan por el CMO; ningún registro con PII del fan sale del clean room hacia la Marca.
**Notas:** el CMO sí aporta un **brief de negocio** (objetivos, marca, calendario) — "cero carga de DATOS del fan" no significa "cero contexto de negocio" (resuelve H-15).

### 4.2 Motor de oportunidades de activación
**Descripción:** identifica y prioriza Oportunidades a partir de los Datos del fan y los derechos. Realiza UJ-1, UJ-3.

#### FR-3: Identificar oportunidades
El sistema identifica Oportunidades basadas en los Datos públicos del hincha (intención, consumo, opinión, narrativa) y, cuando esté disponible, los Datos del fan first-party.
**Consecuencias (testables):** cada Oportunidad incluye segmento objetivo, derecho usado e hipótesis de valor con la **métrica de negocio** que se busca mover (definida según §4.6).

#### FR-4: Priorizar oportunidades por valor potencial
El CMO puede ver las Oportunidades ordenadas por valor potencial estimado.
**Consecuencias (testables):** la lista es ordenable; cada ítem muestra el estimado **y su método de cálculo** (qué métrica, qué supuesto, qué confianza). El método de estimación es transparente y versionado (resuelve H-16).

### 4.3 Generación de activaciones con IA y aprobación
**Descripción:** genera la creatividad de una Oportunidad con IA y comprime el ciclo de aprobación. Realiza UJ-1.

#### FR-5: Generar creatividad de una activación
El CMO puede generar la Activación con IA a partir de una Oportunidad.
**Consecuencias (testables):** se produce ≥1 variante lista para revisión en minutos.

#### FR-6: Flujo de aprobación acelerado
El CMO puede revisar, ajustar y aprobar una Activación dentro del Copiloto.
**Consecuencias (testables):** estado borrador → aprobada con trazabilidad de quién aprobó y cuándo.

### 4.4 Activación self-serve (autonomía de implementación)
**Descripción:** permite implementar la Activación aprobada vía las integraciones. Realiza UJ-1. **Nota de adopción:** el acceso a canales puede estar operado por la agencia; el flujo contempla tanto self-serve directo como ejecución con la agencia como canal (ver Riesgo R-7).

#### FR-7: Implementar activación de forma autónoma
El CMO puede implementar una Activación aprobada por un canal integrado.
**Consecuencias (testables):** una Activación aprobada puede publicarse a ≥1 canal integrado desde el Copiloto.
**Out of Scope (v1):** orquestación multicanal compleja y calendarización avanzada.

### 4.5 Evidencia de ROI para el board
**Descripción:** convierte el resultado de las Activaciones en Evidencia de ROI atribuible. Realiza UJ-1, UJ-2.

#### FR-8: Generar evidencia de ROI
El CMO puede generar un informe de Evidencia de ROI.
**Consecuencias (testables):** el informe vincula Activaciones → conversiones trazables → impacto atribuible **según la Metodología de atribución firmada**, exportable para presentación.

#### FR-9: Caso de valor para renovación (vista Entidad)
El director de la Propiedad puede ver/exportar el valor entregado por Marca.
**Consecuencias (testables):** existe una vista por Marca con el valor acumulado certificado en el periodo.

### 4.6 Metodología de atribución y Valor medible
**Descripción:** define, atribuye, certifica y **audita** el Valor medible. Es el subsistema más sensible; su definición v1 es deliberadamente conservadora para ser cobrable y defendible. Realiza UJ-1, UJ-3.

**Definición de Valor medible en DOS niveles (provisional, a validar con un CFO real — ver §10):** como los sponsors de LaLiga abarcan ambos ciclos, el Valor medible no puede ser de un solo tipo:

- **Nivel 1 — Trazabilidad dura (ciclo corto: e-commerce, delivery, consumo, fintech).** Impacto de negocio directamente trazable a una Activación mediante mecanismos duros (cupón/código único, UTM, enlace dedicado, QR) dentro de una ventana de atribución acordada. Es indiscutible y cobrable; es el beachhead recomendado. *(Apuestas/iGaming quedan fuera por RD 958/2020 — ver §2.2.)*
- **Nivel 2 — Proxy / incrementalidad acordada (ciclo largo: aerolíneas, banca, autos, telco).** Métricas intermedias **pre-acordadas y firmadas** (lift de consideración/recuerdo de marca, búsquedas de marca, leads cualificados) y, donde sea viable, **incrementalidad medible** (test/control, geo-experiments, holdouts). `[NOTE FOR PM]` riesgo abierto: las métricas proxy son del tipo que un CFO escéptico puede rechazar; por eso el estándar de evidencia de Nivel 2 debe validarse con un CFO real **antes** de cobrar sobre él (P-2). El cobro de Nivel 2 puede requerir incrementalidad real, no solo proxy.

#### FR-10: Certificar valor medible según metodología firmada
El sistema certifica Valor medible solo cuando se cumplen los criterios de la Metodología de atribución **firmada con la Propiedad/Marca**.
**Consecuencias (testables):** solo se marca "Valor medible" si la conversión es trazable según la metodología vigente; cada certificación queda registrada, versionada y auditable.

#### FR-11: Registrar evento de valor (cobro desacoplado en Fase 1)
El sistema registra un evento de Valor medible certificado.
**Consecuencias (testables):** no existe evento de valor sin certificación auditable.
**Cambio de alcance (v2 del PRD):** el **disparo de cobro automático se desacopla de Fase 1**. En el piloto, FR-11 registra y reporta valor; el cobro se activa **solo tras** una auditoría real de la metodología (ver §6.1 y §10). `[DECISIÓN PENDIENTE — Seba: confirmar desacople cobro↔piloto]`

#### FR-12 (nuevo): Auditoría y resolución de disputas del valor
El sistema soporta auditoría por un tercero/rol independiente y un flujo de disputa sobre un evento de Valor medible.
**Consecuencias (testables):** un evento puede marcarse "en disputa"; la resolución queda registrada; quien certifica no es el único que valida (rompe el "juez y parte" — resuelve H-2). El muestreo de auditoría es obligatorio y trazable (convierte SM-C1 en control duro — resuelve H-3).

### 4.7 Integración y orquestación
**Descripción:** conecta y orquesta el stack existente en lugar de duplicarlo.

#### FR-13: Conectores con el stack existente
El Consultor/Entidad puede integrar el Copiloto con ≥1 plataforma del stack (Salesforce o Adobe) y un proveedor de LLM.
**Consecuencias (testables):** una integración activa permite leer datos y/o publicar activaciones por la plataforma conectada.

### 4.8 Primer valor inmediato (onboarding en minutos)
**Descripción:** en el primer uso, el usuario obtiene valor en **< 10 minutos y ≤ 3 pasos**, sin esperar a la integración profunda del stack.

**Qué es el "primer valor" GENUINO sin first-party (resuelve la incoherencia del gate):** el valor inicial NO usa el first-party PII del fan (que tarda semanas + dictamen GDPR). Se construye sobre dos fuentes públicas:
1. **Datos públicos del club:** perfil, calendario deportivo, audiencia pública, benchmarks de patrocinio, contexto de la marca dado en el brief.
2. **Datos públicos del hincha (clave para la marca):** sociodemografía, intereses y afinidades de marca, **más señales de intención y narrativa** — qué **busca** el hincha (intención), qué **consume** (comportamiento y canal), qué **opina** (sentimiento) y su **narrativa social** pública. Agregados/anonimizados. Estas señales mapean a la estrella polar: búsqueda → *momento* correcto, consumo → *forma/canal* correcto, opinión/narrativa → *mensaje* correcto. Es justo lo que la marca quiere para sus objetivos.

Con eso el sistema entrega un **mapa de oportunidades de activación priorizado + un concepto de activación generado con IA** que ya habla **del hincha**, no solo del club. Es valor real y accionable —no un demo vacío—; la **precisión se profundiza** cuando entra el first-party vía clean room (FR-1/FR-2). Realiza UJ-1.

#### FR-14: Valor en el primer uso sin integración profunda
El CMO obtiene al menos una Oportunidad accionable y un concepto de Activación en su **primer uso**, en < 10 min y ≤ 3 pasos, basados en datos públicos/agregados, sin completar la integración del stack.
**Consecuencias (testables):**
- En la primera sesión (< 10 min, ≤ 3 pasos), el sistema entrega ≥1 Oportunidad + una previsualización de Activación.
- El primer valor se computa sobre datos públicos/agregados del **club y del hincha** (no first-party PII del fan) y no exige conectar Salesforce/Adobe ni el clean room.
- La integración profunda puede completarse después y **eleva la precisión** sin haber bloqueado el primer valor.

## 5. No-Goals (explícitos)

- No es un **SaaS por suscripción**; el cobro es por Valor medible certificado.
- No reclama **atribución causal econométrica "perfecta"** en v1; v1 = trazabilidad directa, defendible y auditable.
- No **reemplaza el stack martech**: lo orquesta.
- No **reemplaza por completo a la agencia**: la desintermedia donde el cliente gana autonomía, y la contempla como posible canal.
- No es **multi-deporte/multi-liga a escala** ni multi-idioma en v1.
- No **transfiere PII cruda del fan a la Marca**: opera vía clean room.

## 6. Alcance del MVP

### 6.1 Dentro (por fases)

**Fase 0 — Demo / PoC (abrir puertas):** demo navegable con datos de muestra que cuenta la historia completa (oportunidad → activación IA → evidencia de ROI). La demo **expone honestamente los pre-requisitos** (datos, derechos, cumplimiento) como parte del pitch, no como letra chica (resuelve H-10). Incluye FR-3, FR-5, FR-8 en modo demostrativo.

**Fase 1 — Piloto funcional acotado (validación):** sobre 1 club de LaLiga + 1 Marca, idealmente un **sponsor de ciclo corto** (beachhead) para validar primero la trazabilidad dura (Nivel 1). Objetivo: **validar la metodología de atribución y la propuesta de valor**, no facturar. Incluye Data servida vía clean room (FR-1, FR-2), motor de oportunidades (FR-3, FR-4), generación + aprobación (FR-5, FR-6), una integración real e implementación (FR-7, FR-13), evidencia de ROI real (FR-8, FR-9) y certificación + auditoría de valor (FR-10, FR-11, FR-12) **sin cobro automático**. El cobro por valor se activa en una fase posterior, tras auditoría de la metodología.

### 6.2 Fuera del MVP

- Cobro automático por valor — *gated tras auditoría de metodología*.
- Atribución incremental avanzada (test/control, geo, holdouts) — *v2; v1 usa trazabilidad directa*.
- Cobro sobre Nivel 2 (proxy/incrementalidad para ciclo largo) — *en alcance del producto, pero el cobro requiere validar el estándar de evidencia con un CFO (P-2); no se factura hasta entonces*.
- Orquestación multicanal avanzada — *complejidad; v2*.
- Multi-deporte/multi-liga y multi-idioma a escala — *foco acotado primero*.
- Marketplace de activaciones — *v3*. `[NOTE FOR PM]` emocionalmente importante; revisitar.

## 7. Métricas de éxito

**Primaria**
- **SM-1**: **Adopción temprana para aprendizaje** — al menos **4 clubes de LaLiga probando el Copiloto y entregando feedback**, aunque no haya venta cerrada. Es una métrica de uso/aprendizaje: valida que el producto entra y genera interacción real, no ingresos. Meta de conversión asociada: **≥1 club que comprometa datos reales** para un piloto profundo (Fase 1). Valida la tesis de adopción temprana.

**Secundarias** `[SUPUESTO — targets a validar]`
- **SM-2**: **Ciclo de activación** — tiempo Oportunidad → implementación reducido vs. flujo agencia. Valida FR-5, FR-6, FR-7.
- **SM-3**: **Valor medible certificado** — nº de eventos certificados y auditados en el piloto. Valida FR-10, FR-11, FR-12.
- **SM-4**: **Renovación/prima** — ≥1 caso de renovación o mejora de prima atribuible al uso. Valida FR-8, FR-9.
- **SM-5**: **Tiempo al primer valor (TTFV)** — mediana de tiempo hasta el primer valor en el primer uso **< 10 minutos** y **≤ 3 pasos**. Valida FR-14. *Restricción dura: si la primera aproximación tarda horas, es un fracaso. Los 10 min son también argumento de venta y de entrada.*
- **SM-6**: **Señal de disposición a pagar** — aunque el cobro está desacoplado del piloto, ≥1 cliente firma un **compromiso de precio por valor** (term sheet sujeto a auditoría de la metodología). Valida el **modelo de negocio**, no solo el uso (resuelve el hallazgo "el piloto valida la herramienta, no el negocio"). Ligado a P-1.

**Counter-metrics (no optimizar — ahora con control duro)**
- **SM-C1**: **Sobre-atribución** — % de eventos de valor revertidos en auditoría debe tender a cero. **Control duro:** metodología inmutable post-firma, muestreo de auditoría obligatorio (FR-12), penalización contractual por sobre-atribución (resuelve H-3). Contrapesa SM-3/SM-1.
- **SM-C2**: **Carga sobre el CMO** — pasos de carga de DATOS del fan exigidos al CMO = cero (el brief de negocio no cuenta como carga de datos del fan).

## 8. Preguntas abiertas

1. **Estándar de evidencia de Nivel 2** (proxy/incrementalidad para ciclo largo): qué métricas, qué ventanas, cuándo se exige incrementalidad real para poder cobrar. *(Elevada a Precondición P-2 — crítica dado que los sponsors de LaLiga son mayoritariamente de ciclo largo.)*
2. **Reparto de valor** consultora ↔ Propiedad ↔ Marca. *(Parte de Precondición P-1.)*
3. **Modelo de cobro híbrido** para ciclo largo (retainer + success-fee) cuando el proxy no baste.

*Decididas: deporte/región = LaLiga España (P-3 cerrada); integración = sigue al piloto, default Salesforce, LLM del proveedor; ICP = ambos ciclos con beachhead de ciclo corto.*

## 9. Índice de supuestos

- §2.2 — ICP = ambos ciclos; beachhead con sponsor de ciclo corto (a confirmar el club/sponsor concreto).
- §2.2 / §6 — Deporte/región = LaLiga España. ✓ Decidido.
- §4.1 — La Propiedad concede acceso y existe base legal GDPR → elevado a P-4.
- §4.6 — Estándar de evidencia de Nivel 2 (ciclo largo) es cobrable y defendible → validar con CFO (P-2).
- §7 — Targets de métricas secundarias a validar.
- §Monetización — reparto entidad↔consultora por definir → P-1.

## 10. Precondiciones de Fase 1 *(nuevo en v2 — gates antes de arquitectura/épicas)*

El reviewer adversarial recomienda no avanzar a construcción de Fase 1 sin cerrar estos gates. Cada uno tiene dueño y debe resolverse antes de comprometer SM-1:

- **P-1 — Term sheet / contrato marco con UNA Propiedad** que defina qué es valor, cómo se mide, quién audita, qué pasa en disputa y cómo se reparte. *Convierte el modelo de ingresos de supuesto a requisito.* Dueño: Seba/consultora. (Resuelve H-1.)
- **P-2 — Estándar de evidencia cobrable validado con un CFO real** antes de construir el motor de certificación. *Decide el umbral mínimo defendible.* Dueño: Seba. (Resuelve H-5/H-6.)
- **P-3 — Deporte/región del piloto. ✓ CERRADA: fútbol, clubes de LaLiga (España).** (Resuelve H-14.)
- **P-4 — Diagnóstico de madurez de datos de clubes LaLiga candidatos + base legal bajo GDPR (España/UE)**, y diseño del clean room que permita activar sin transferir PII del fan a la Marca. Dueño: Seba + asesoría legal. (Resuelve H-7/H-8.)
- **P-5 — Go-to-market explícito para SM-1** (ver §11). Dueño: Seba. (Resuelve H-9.)

## 11. Go-to-Market (para SM-1) *(nuevo en v2)*

`[DECISIÓN PENDIENTE — Seba: completar con datos reales]`

- **Pipeline nominal:** lista de Propiedades candidatas concretas (no genérico).
- **Relaciones que abren puertas:** qué contactos del consultor/consultora dan acceso a decisores.
- **Quién vende y embudo esperado:** responsable comercial, nº de contactos calientes, tasa de conversión asumida.
- **Definición de "ganado":** acuerdo de piloto con datos comprometidos, no solo LOI; gate de cualificación de la Propiedad antes de contar como adopción.
- **Plazo realista:** evaluar si 30 días es alcanzable o si 1 trimestre con pilotos profundos valida mejor.

## 12. Riesgos y panorama competitivo *(nuevo en v2)*

**Registro de riesgos** (prob./impacto/mitigación/dueño — a cuantificar):

- **R-1 (negocio, alto):** el cobro por valor no es contractualizable → mitigación P-1; dueño Seba.
- **R-2 (probatorio, alto):** "atribución suficiente" no resiste a un CFO escéptico → mitigación P-2 + v1 de trazabilidad dura.
- **R-3 (datos/legal, alto):** la Propiedad no tiene datos usables, no los cede, o falta base legal → mitigación P-4 + clean room.
- **R-4 (modelo, ALTO — sube por LaLiga):** los sponsors principales de LaLiga son de ciclo largo (aerolíneas, banca, autos, telco) y no muestran valor trazable en la ventana del piloto → mitigación: beachhead con sponsor de ciclo corto para probar el modelo, y estándar de evidencia de Nivel 2 (proxy/incrementalidad) validado con CFO antes de cobrar (P-2).
- **R-5 (go-to-market, alto):** SM-1 sin máquina de ventas → mitigación P-5.
- **R-6 (reputacional, medio):** la demo vende lo que la Fase 1 no cumple → mitigación: pre-requisitos honestos + gate de cualificación.
- **R-7 (adopción, alto):** la agencia bloquea el self-serve (controla cuentas/canales y la relación) → mitigación: validar con CMOs reales, posicionar a la agencia como canal/aliado, mapear control de accesos en el piloto (resuelve H-11).
- **R-8 (competitivo, alto):** sin foso técnico, incumbentes con distribución (Salesforce/Adobe) o holdings (WPP/Publicis) lo copian → ver Foso.
- **R-9 (producto/arquitectura, ALTO):** el TTFV en minutos choca con la complejidad de integrar el stack enterprise + clean room → mitigación: ruta de primer valor desacoplada (datos semilla/muestra o conector ligero) e integración profunda progresiva en segundo plano (FR-14). Es la tensión técnica central del MVP.

**Panorama competitivo:** Salesforce (Marketing Cloud + Data Cloud), Adobe (Experience Platform / RT-CDP), holdings de agencias (WPP, Publicis) con capacidades de data, y soluciones de medición/atribución existentes. El Copiloto se monta sobre su stack, lo que les da visibilidad de la oportunidad.

**Foso / defensibilidad** (a construir, hoy ausente — resuelve H-12): (a) **dato propietario acumulado** de atribución cross-Propiedad (benchmark que mejora con cada piloto), (b) la **metodología de atribución certificada/auditada** como activo, (c) **lock-in de dos lados** (relación Propiedad↔Marcas), (d) **velocidad de aprendizaje**. `[DECISIÓN PENDIENTE — Seba: elegir el/los foso(s) a priorizar]`

## 13. Why Now

Demanda (CFOs exigiendo prueba) y capacidad (IA, LLMs, datos) acaban de coincidir. La muleta actual del CMO —visibilidad estilo AVE— es justo lo que el CFO rechaza. La ventana de valor está en el ensamblaje, la adopción temprana **y la metodología defendible**; el foso no es solo "llegar primero" (ver §12).

## 14. Integración y dependencias

- **Stack objetivo:** Salesforce, Adobe (martech); Azure, Google (infra); LLMs de esos proveedores y/o propio.
- **Dependencia crítica:** acceso a Datos del fan y derechos de la Propiedad, vía clean room y con base legal (P-4).
- **Principio:** orquestar, no duplicar.
- **Integración progresiva (por el TTFV):** la integración enterprise NO puede ser un prerrequisito del primer valor. Arquitectura en dos caminos: (1) ruta ligera para valor inmediato (minutos), (2) integración profunda (clean room + conectores) progresiva en segundo plano. Ver NFR TTFV y R-9.

## 15. Monetización

**Precio por valor:** el cliente paga cuando se certifica Valor medible auditado; no hay suscripción SaaS. **Tensión reconocida (resuelve H-3):** un modelo "por valor" crea presión a **sobre-atribuir del lado del vendedor**, no solo a disputar del lado del comprador; por eso el control es duro (FR-12, SM-C1) y la certificación no puede ser juez y parte. Ingresos del Consultor vía la consultora por identificación/desarrollo/captura de oportunidades; la plataforma es el habilitador. Reparto Propiedad↔consultora: P-1.

## 16. Gobernanza de datos

**Régimen aplicable: GDPR (España/UE).** Dos categorías de dato con tratamiento distinto:

- **First-party PII del fan:** propiedad de la Propiedad; el consentimiento del fan a su club **no se extiende automáticamente** al uso por la Marca. Opera vía **clean room** (segmentos modelados sin exponer PII a la Marca). Dictamen legal GDPR es **gate de Fase 1** (P-4).
- **Datos públicos del hincha:** usables para el primer valor sin clean room, pero **manteniéndolos agregados/anonimizados** — bajo GDPR el dato personal sigue protegido aunque sea público, así que el primer valor no debe perfilar individuos, solo la afición en agregado.

La promesa "cero carga al CMO" no elimina la carga de cumplimiento: la asume la Propiedad/Consultor.

## 17. NFRs transversales

- **Tiempo al primer valor (TTFV) — restricción dura:** en el primer uso el usuario obtiene valor en **< 10 minutos** y muy pocos pasos; si tarda horas, es un fracaso. Obliga a desacoplar el primer valor de la integración profunda (ruta ligera con datos semilla/muestra o conector mínimo; integración enterprise progresiva en segundo plano). Es la restricción de diseño con mayor impacto en la arquitectura (ver §14 y R-9).
- **Auditabilidad:** todo evento de Valor medible, certificación y cobro es auditable y versionado (soporta SM-C1 y el modelo de cobro).
- **Tiempo de generación:** generación de Activaciones en minutos (sostiene el ciclo comprimido).
- **Privacidad por diseño:** ningún flujo expone PII del fan a la Marca fuera del clean room.
- **Cero carga de datos del fan al CMO:** restricción verificable (SM-C2).
- **Seguridad:** cifrado en tránsito (TLS) y en reposo de los Datos del fan; control de acceso por rol; cumplimiento **GDPR** (base legal, minimización, derechos del interesado, registro de tratamiento), con la PII confinada al clean room.
