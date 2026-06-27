---
stepsCompleted: ["step-01", "step-02", "step-03", "step-04"]
status: final
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-MetodoBMAD-2026-06-27/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-MetodoBMAD-2026-06-27/ARCHITECTURE-SPINE.md
---

# Copiloto de Patrocinio Deportivo - Epic Breakdown

## Overview

Este documento descompone los requisitos del PRD v2.4 y las decisiones del Architecture Spine en épicas e historias implementables. No hay documento UX (se omitió en planificación).

## Requirements Inventory

### Functional Requirements

FR-1: Conectar las fuentes de Datos del fan de la Propiedad al sistema (sin que el CMO haga nada).
FR-2: Servir datos al motor de oportunidades vía clean room, sin exponer PII y sin carga del CMO.
FR-3: Identificar oportunidades de activación a partir de datos públicos del hincha (qué busca/consume/opina + narrativa) y, cuando esté, el first-party.
FR-4: Priorizar oportunidades por valor potencial, con método de cálculo transparente y versionado.
FR-5: Generar la creatividad de una activación con IA en minutos.
FR-6: Flujo de aprobación acelerado (borrador → aprobada, con trazabilidad).
FR-7: Implementar una activación aprobada de forma autónoma por un canal integrado.
FR-8: Generar evidencia de ROI atribuible según la metodología firmada.
FR-9: Vista/exportación del caso de valor por Marca para la Propiedad (renovación).
FR-10: Certificar valor medible según la metodología de atribución firmada.
FR-11: Registrar evento de valor (cobro desacoplado de Fase 1).
FR-12: Auditoría y resolución de disputas de un evento de valor (no juez-y-parte).
FR-13: Conectores con el stack existente (Salesforce/Adobe + proveedor LLM).
FR-14: Entregar valor en el primer uso (< 10 min, ≤ 3 pasos) sobre datos públicos, sin integración profunda.
FR-15: Gestionar los derechos contratados del patrocinio (catálogo de activos por Marca).
FR-16: Capturar el ADN de marca (valores, tono, identidad, posicionamiento), con pre-relleno asistido por IA.
FR-17: Capturar los objetivos de comunicación/campaña de la Marca.
FR-18: Capturar contexto adicional (audiencia objetivo, calendario, productos/mensajes, restricciones de marca, mercados).

### NonFunctional Requirements

NFR-1: Tiempo al primer valor (TTFV) < 10 min y ≤ 3 pasos (restricción dura; instrumentada).
NFR-2: Auditabilidad: todo evento de valor, certificación y cobro versionado y auditable (append-only).
NFR-3: Privacidad por diseño (GDPR): la PII nunca sale del clean room; solo cruzan segmentos agregados/anonimizados.
NFR-4: Cero carga de datos del fan al CMO (el brief de negocio no cuenta como carga de datos).
NFR-5: Generación de activaciones en minutos (sostiene el ciclo comprimido).
NFR-6: Seguridad: TLS en tránsito, cifrado en reposo, control de acceso por rol, cumplimiento GDPR.

### Additional Requirements

- **Starter/stack (Epic 1, Story 1):** Next.js 16 (App Router) + Supabase + Vercel AI SDK + Tailwind/shadcn, TypeScript. Estructura de monolito modular con `core/`, `ports/`, `adapters/`, `app/`, `workers/`, `data/` (AD-1, AD-2).
- **Doble plano:** plano ligero independiente del profundo; el ligero nunca depende del profundo; degradación elegante (AD-1).
- **Frontera de datos:** dominios separados Inteligencia Pública (sin PII) vs Clean Room (PII aislado); solo cruzan segmentos agregados; catálogo cerrado con k-mínimo, sin IDs por-fan (AD-3, AD-8).
- **Motor de valor:** metodología versionada/firmada; eventos append-only; certificación separada del cobro (AD-4).
- **Adaptadores:** lo externo solo por puertos con contrato estable; idempotencia en efectos externos (AD-5).
- **Entornos:** local → preview (por cambio en GitHub) → producción (Vercel + Supabase); secretos fuera del repo (AD-6).
- **Propiedad del estado:** un módulo dueño por entidad; workers no escriben directo a tablas de dominio (AD-7).
- **Identidad/tenancy:** RBAC de 3 actores (Consultor/Propiedad/Marca) + RLS de Supabase como frontera de AD-3; multi-tenant por Propiedad (AD-9).
- **Observabilidad:** métrica de TTFV, trazas cruzando puertos, alertas de cola del plano profundo.

### UX Design Requirements

No aplica (no se produjo documento UX en la planificación). La UX detallada se definirá durante la implementación o en una iteración posterior.

### FR Coverage Map

- FR-1: Épica 4 — conectar fuentes de la Propiedad.
- FR-2: Épica 4 — servir datos vía clean room sin PII.
- FR-3: Épica 1 — identificar oportunidades sobre datos públicos.
- FR-4: Épica 1 — priorizar oportunidades.
- FR-5: Épica 3 — generar creatividad con IA.
- FR-6: Épica 3 — flujo de aprobación.
- FR-7: Épica 3 — implementar activación self-serve.
- FR-8: Épica 5 — evidencia de ROI.
- FR-9: Épica 5 — caso de valor para renovación.
- FR-10: Épica 5 — certificar valor medible.
- FR-11: Épica 5 — registrar evento de valor.
- FR-12: Épica 5 — auditoría y disputa.
- FR-13: Épica 3 — conectores con el stack (publicación; framework de adaptadores reutilizado en Épica 4).
- FR-14: Épica 1 — primer valor (TTFV).
- FR-15: Épica 2 — derechos contratados.
- FR-16: Épica 2 — ADN de marca.
- FR-17: Épica 2 — objetivos de comunicación.
- FR-18: Épica 2 — contexto adicional.

## Epic List

### Épica 1: Cimientos + Primer valor (TTFV)
Montaje del proyecto (stack Next.js + Supabase + Vercel AI SDK, estructura modular del doble plano) y la experiencia del plano ligero: el usuario entra y en menos de 10 minutos obtiene un mapa de oportunidades priorizado + un concepto de activación sobre datos públicos del club y del hincha. Es la demo de Fase 0 que capta clubes.
**FRs covered:** FR-14, FR-3, FR-4.

### Épica 2: Contexto y personalización
Capturar y mantener el contexto que personaliza las recomendaciones y generaciones: derechos contratados, ADN de marca (con pre-relleno asistido por IA), objetivos de comunicación y contexto adicional. Captura progresiva para no romper el TTFV.
**FRs covered:** FR-15, FR-16, FR-17, FR-18.

### Épica 3: Generación y activación
Generar la creatividad de una activación con IA, revisarla y aprobarla dentro de la herramienta, e implementarla de forma autónoma por un canal conectado. Incluye el framework de adaptadores/conectores.
**FRs covered:** FR-5, FR-6, FR-7, FR-13.

### Épica 4: Datos profundos (clean room)
Conectar las fuentes de Datos del fan de la Propiedad y servirlos vía clean room sin exponer PII (solo segmentos agregados), elevando la precisión del plano ligero. Plano profundo, GDPR-safe.
**FRs covered:** FR-1, FR-2.

### Épica 5: Valor medible y evidencia
Certificar el valor con metodología versionada y firmada, registrar eventos de valor auditables (append-only), soportar auditoría y disputa, y producir la evidencia de ROI para el board y el caso de valor de renovación para la Propiedad.
**FRs covered:** FR-8, FR-9, FR-10, FR-11, FR-12.

---

## Epic 1: Cimientos + Primer valor (TTFV)

El usuario obtiene valor en menos de 10 minutos sobre datos públicos, sobre una base de proyecto coherente. (FR-14, FR-3, FR-4)

### Story 1.1: Montaje del proyecto y estructura modular
As a desarrollador,
I want el proyecto inicializado con el stack y la estructura modular del doble plano,
So that las features se construyan sobre una base coherente y lista para el handoff.

**Acceptance Criteria:**
**Given** un repositorio vacío
**When** se inicializa el proyecto con Next.js 16 (App Router) + Supabase + Vercel AI SDK + Tailwind/shadcn
**Then** existe la estructura `app/`, `core/`, `ports/`, `adapters/`, `workers/`, `data/`
**And** auth de Supabase con **RBAC básico de los 3 roles (Consultor, Propiedad, Marca)** y variables de entorno configuradas (secretos fuera del repo); el proyecto corre en local. *(El RLS reforzado del clean room se aborda en la Historia 4.1.)*

### Story 1.2: Ingesta de datos públicos del club y del hincha
As a sistema,
I want ingestar señales públicas del club y del hincha (qué busca/consume/opina + narrativa, sociodemografía),
So that el motor de oportunidades tenga materia prima sin PII.

**Acceptance Criteria:**
**Given** un club seleccionado
**When** se ejecuta la ingesta de fuentes públicas
**Then** se almacenan señales agregadas en el Almacén de Inteligencia Pública (sin PII)
**And** cada señal registra su fuente y fecha; nada con PII entra en este almacén.

### Story 1.3: Generar mapa de oportunidades sobre datos públicos
As a CMO,
I want ver oportunidades de activación basadas en los datos públicos del hincha,
So that sepa qué puedo hacer con el patrocinio.

**Acceptance Criteria:**
**Given** señales públicas ingestadas para un club
**When** abro el dashboard de oportunidades
**Then** veo una lista de oportunidades, cada una con segmento objetivo, señal que la origina e hipótesis de valor de negocio
**And** si no hay señales suficientes, se muestra un estado vacío claro.

### Story 1.4: Priorizar oportunidades por valor potencial
As a CMO,
I want las oportunidades ordenadas por valor potencial con su método de cálculo,
So that enfoque primero lo de mayor impacto y confíe en el orden.

**Acceptance Criteria:**
**Given** una lista de oportunidades
**When** la veo en el dashboard
**Then** está ordenada por valor potencial estimado y cada ítem muestra el estimado y su método (qué métrica, qué supuesto, qué confianza)
**And** puedo reordenar/filtrar.

### Story 1.5: Primer valor en menos de 10 minutos (onboarding ligero)
As a CMO o consultor nuevo,
I want obtener oportunidades + un concepto de activación en mi primer uso, en pocos pasos,
So that perciba el valor de inmediato sin integraciones.

**Acceptance Criteria:**
**Given** un primer uso sin integración profunda
**When** recorro el flujo de onboarding de exactamente ≤ 3 pasos — (1) elegir club, (2) elegir marca/objetivo mínimo, (3) ver resultado
**Then** en menos de 10 minutos obtengo un mapa de oportunidades + un concepto de activación
**And** el tiempo al primer valor queda instrumentado (métrica TTFV); el camino no exige conectar Salesforce/Adobe ni el clean room.
**And** los 3 pasos/pantallas están especificados como un mini-spec UX antes de implementar (no hay documento UX previo; esta historia lo define para el primer flujo).

## Epic 2: Contexto y personalización

Las recomendaciones y generaciones se personalizan con el contexto de marca y patrocinio. (FR-15, FR-16, FR-17, FR-18)

### Story 2.1: Gestionar derechos contratados
As a consultor o Propiedad,
I want registrar el catálogo de derechos contratados por Marca,
So that el sistema solo proponga activaciones sobre derechos reales.

**Acceptance Criteria:**
**Given** una Marca patrocinadora
**When** registro/edito sus derechos contratados (camiseta, LED, hospitality, contenido, datos, etc.)
**Then** quedan asociados a esa Marca
**And** las oportunidades propuestas se limitan a derechos efectivamente contratados.

### Story 2.2: Capturar ADN de marca con pre-relleno asistido por IA
As a CMO,
I want capturar el ADN de mi marca (valores, tono, identidad, posicionamiento), con un pre-relleno propuesto por IA,
So that las generaciones respeten mi marca sin partir de cero.

**Acceptance Criteria:**
**Given** una Marca con presencia pública
**When** abro la captura de ADN de marca
**Then** el sistema propone un borrador a partir de fuentes públicas
**And** puedo editarlo y guardarlo; queda disponible para la generación.

### Story 2.3: Capturar objetivos de comunicación
As a CMO,
I want registrar los objetivos de comunicación/campaña,
So that la priorización de oportunidades se alinee con mis metas.

**Acceptance Criteria:**
**Given** una Marca
**When** registro objetivos (awareness, consideración, conversión, lanzamiento, etc.)
**Then** se guardan como contexto vigente
**And** la priorización (Story 1.4) los toma en cuenta.

### Story 2.4: Capturar contexto adicional
As a CMO,
I want registrar audiencia objetivo, calendario, productos/mensajes y restricciones de marca,
So that las recomendaciones consideren mi situación real.

**Acceptance Criteria:**
**Given** una Marca
**When** registro contexto adicional
**Then** se guarda y queda referenciable por oportunidades y generación
**And** los campos son opcionales (captura progresiva, no bloquea el primer valor).

### Story 2.5: Personalizar oportunidades y generación con el contexto
As a CMO,
I want que las oportunidades y generaciones usen mi contexto registrado,
So that dejen de ser genéricas.

**Acceptance Criteria:**
**Given** un contexto de marca registrado
**When** se generan/priorizan oportunidades
**Then** referencian derechos, ADN y objetivos vigentes
**And** sin contexto mínimo, el sistema usa valores públicos por defecto y marca la personalización como "básica".

## Epic 3: Generación y activación

El usuario genera, aprueba e implementa activaciones. (FR-5, FR-6, FR-7, FR-13)

### Story 3.1: Framework de adaptadores y adaptador de LLM
As a desarrollador,
I want un framework de puertos/adaptadores con un adaptador de LLM (Azure/Google vía AI SDK),
So that el núcleo invoque IA sin acoplarse a un proveedor.

**Acceptance Criteria:**
**Given** la necesidad de llamar a un LLM
**When** el núcleo usa el puerto `LlmPort`
**Then** la llamada pasa por un adaptador intercambiable
**And** cambiar de proveedor no toca el núcleo; efectos externos son idempotentes.

### Story 3.2: Generar creatividad de activación con IA
As a CMO,
I want generar la creatividad de una activación a partir de una oportunidad, respetando mi ADN de marca,
So that produzca contenido relevante en minutos.

**Acceptance Criteria:**
**Given** una oportunidad y un ADN de marca
**When** pido generar la activación
**Then** obtengo al menos una variante lista para revisión en minutos
**And** la variante respeta el tono e identidad del ADN.

### Story 3.3: Revisar, editar y aprobar la activación
As a CMO,
I want revisar, ajustar y aprobar una activación dentro de la herramienta,
So that comprima el ciclo con la agencia.

**Acceptance Criteria:**
**Given** una activación generada
**When** la edito y la apruebo
**Then** su estado transita borrador → aprobada con autor y fecha
**And** solo el módulo de dominio muta el estado.

### Story 3.4: Implementar la activación self-serve por un canal conectado
As a CMO,
I want publicar una activación aprobada por un canal integrado sin la agencia,
So that gane autonomía de implementación.

**Acceptance Criteria:**
**Given** una activación aprobada y un canal conectado vía adaptador
**When** la implemento
**Then** se publica por ese canal desde la herramienta
**And** la publicación es idempotente y queda registrada; el adaptador ejecuta sin mutar el estado de dominio.

### Story 3.5: Generar mecanismo de trazabilidad en la activación
As a sistema,
I want incrustar un mecanismo de trazabilidad único (cupón/UTM/QR/enlace dedicado) en cada activación publicada,
So that el valor pueda certificarse después (habilita la Épica 5).

**Acceptance Criteria:**
**Given** una activación aprobada que se va a publicar
**When** se genera para publicación
**Then** incluye un identificador de trazabilidad único asociado a la activación (cupón/UTM/QR/enlace)
**And** ese identificador queda registrado y es el que la Historia 5.2 usa para certificar conversiones trazables.
*(Hallazgo del party: sin esta historia, la Épica 5 mediría un valor que el producto nunca generó.)*

## Epic 4: Datos profundos (clean room)

Se eleva la precisión con first-party del fan, sin exponer PII. (FR-1, FR-2)

### Story 4.1: Conectar fuentes de la Propiedad y configurar el clean room
As a consultor o Propiedad,
I want conectar las fuentes de Datos del fan en un clean room aislado,
So that el first-party esté disponible de forma segura.

**Acceptance Criteria:**
**Given** credenciales/fuentes de la Propiedad
**When** las conecto
**Then** el sistema lista las fuentes y su estado (conectada/error) y las aloja en el Clean Room (aislado, con **RLS reforzado** sobre el RBAC básico de la Historia 1.1)
**And** el rol Marca no puede leer filas del Clean Room; aislamiento reforzado por Propiedad.

### Story 4.2: Servir segmentos agregados al plano ligero sin PII
As a sistema,
I want exponer un catálogo cerrado de segmentos agregados desde el clean room,
So that el plano ligero gane precisión sin recibir PII.

**Acceptance Criteria:**
**Given** datos first-party en el clean room
**When** el plano ligero solicita un segmento del catálogo
**Then** recibe un segmento agregado que cumple k-mínimo y lista blanca de atributos
**And** el puerto rechaza cualquier payload bajo umbral o con identificadores por-fan; no hay consulta libre.
**And** el catálogo de segmentos lo define el Consultor/Propiedad (segmentos pre-calculados aprobados), no se genera por consulta libre del usuario.

### Story 4.3: Elevar la precisión de oportunidades con first-party
As a CMO,
I want que las oportunidades usen los segmentos del clean room cuando existan,
So that mejoren respecto al valor solo-público.

**Acceptance Criteria:**
**Given** segmentos agregados disponibles
**When** se generan oportunidades
**Then** incorporan los segmentos del clean room y marcan la precisión como "elevada"
**And** si el clean room falla o está pendiente, se opera con datos públicos y se marca "pendiente" (sin bloquear).

## Epic 5: Valor medible y evidencia

Se certifica el valor, se audita y se demuestra ante el board. (FR-8, FR-9, FR-10, FR-11, FR-12)

### Story 5.1: Definir y versionar la metodología de atribución
As a consultor,
I want crear y versionar/firmar la metodología de atribución,
So that el valor se mida de forma defendible y estable.

**Acceptance Criteria:**
**Given** la necesidad de medir valor
**When** defino una metodología (métrica, ventana, reglas de trazabilidad)
**Then** se guarda como versión firmada e inmutable
**And** cambios crean una nueva versión; las anteriores se conservan.

### Story 5.2: Registrar eventos de valor medible
As a sistema,
I want certificar y registrar eventos de valor según la metodología vigente,
So that exista evidencia trazable.

**Acceptance Criteria:**
**Given** una activación y una metodología firmada
**When** se cumple el criterio de valor (p. ej. conversión trazable)
**Then** se registra un EventoDeValor append-only que referencia la versión de metodología
**And** no se registra ningún evento sin versión referenciada; el cobro está desacoplado en Fase 1.

### Story 5.3: Auditoría y disputa de eventos de valor
As a auditor o cliente,
I want auditar y, si corresponde, disputar un evento de valor,
So that el modelo no sea juez-y-parte.

**Acceptance Criteria:**
**Given** un EventoDeValor certificado
**When** lo audito o lo disputo
**Then** puedo marcarlo "en disputa" y la resolución queda registrada
**And** el muestreo de auditoría es obligatorio y trazable; quien certifica no es el único validador.

### Story 5.4: Evidencia de ROI para el board
As a CMO,
I want generar un informe de evidencia de ROI,
So that demuestre el impacto del patrocinio ante el board.

**Acceptance Criteria:**
**Given** eventos de valor certificados
**When** genero la evidencia de ROI
**Then** el informe vincula activaciones → conversiones/métricas → impacto atribuible según la metodología firmada
**And** es exportable para presentación.

### Story 5.5: Caso de valor de renovación para la Propiedad
As a director de la Propiedad,
I want ver/exportar el valor entregado por Marca,
So that negocie renovaciones y mejores primas con datos.

**Acceptance Criteria:**
**Given** valor certificado en un periodo
**When** abro la vista Entidad
**Then** veo el valor acumulado por Marca y puedo exportar el caso
**And** ante una disputa, accedo al log de certificación y a la metodología firmada.
