# Intent Doc — Copiloto de Patrocinio Deportivo (datos + IA generativa)

Proyecto MetodoBMAD · 2026-06-27 · Insumo destilado de la sesión de brainstorming para alimentar bmad-product-brief y bmad-prd.

---

## Problema raíz (Five Whys)

El patrocinio deportivo no puede demostrar su impacto en el crecimiento del negocio porque falta trazabilidad que conecte la visibilidad con la atribución en ventas. Esa trazabilidad no existe porque medir cómo el branding impacta la venta es intrínsecamente complejo, y hoy se sustituye por equivalencias y proxies construidos sobre supuestos. La presión de los CFOs y la llegada de la IA exigen ahora demostrar impacto real, no supuestos. **Raíz:** existe un hueco abierto: el mercado no ha madurado en ensamblar la **captura de datos** con la **explotación inteligente** de esos datos. La demanda (CFO) y la capacidad (IA) ya coexisten; falta el puente y su adopción.

## El pivote / corazón del producto

El dolor real del CMO **no es medir, es EXPLOTAR las oportunidades del patrocinio para maximizar el ROI**. El producto no es un medidor: es un **copiloto que hace ganar más**, con la data servida (no pedida al CMO). Medir es soporte y evidencia, no el corazón del producto.

## Estructura de mercado (3 jugadores)

1. **Consultor / tercero (usuario que construye):** desarrolla y provee la solución.
2. **Entidad deportiva (cliente que paga y distribuye):** paga la solución, la disponibiliza al CMO y **aporta los datos del fan + los derechos**. Busca renovaciones y mejores primas.
3. **Marca / CMO (beneficiario final, usuario):** consume la solución para extraer el máximo valor del patrocinio.

El consultor provee a la entidad; la entidad disponibiliza a la marca.

## Job To Be Done

El progreso que busca el CMO es **emocional/social, no funcional: quedar como héroe** (estatus y reconocimiento).

- **Escena héroe / demo asesina:** el CMO, ante el **board**, demuestra con datos que la alianza con la propiedad deportiva fue mecanismo de conexión con el cliente y palanca de venta, con impacto significativo en el crecimiento del negocio gracias a su decisión.
- **Estrella polar (value prop):** el patrocinio permite entregar *el mensaje correcto, en el momento correcto, de la forma correcta, a la persona correcta* — precision marketing aplicado al patrocinio deportivo = crecimiento del negocio demostrable.

## Competidor actual (lo que el CMO contrata hoy)

Implementar **activaciones sueltas** alrededor del patrocinio + medir **visibilidad** como aproximación a compra de pauta de medios (lógica AVE / media value). **Por qué falla:** ese proxy basado en supuestos es justo lo que el **CFO ya no acepta**.

## Segundo dolor: fricción operativa en la activación

Activar los derechos del patrocinio es **lento** por el ciclo de comunicación marca ↔ agencia. La marca trabaja con una agencia: la agencia desarrolla las creatividades, el cliente las aprueba, la agencia implementa. Las idas y vueltas —para identificar oportunidades y para las aprobaciones— generan pérdida de tiempo y **ventanas de oportunidad que se pierden**. No es solo un problema de *qué* activar, sino de *qué tan rápido* se puede activar.

**Implicación:** la IA generativa permite **comprimir ese ciclo** (identificar la oportunidad + generar la creatividad + acelerar la aprobación), atacando directamente la lentitud del modelo agencia-marca. Refuerza el corazón "copiloto" y la restricción de "valor inmediato".

**Rol de la agencia (decisión):** la agencia queda **fuera del loop cuando el cliente gana autonomía para implementar**. Por tanto el copiloto debe habilitar la **autonomía de implementación del CMO/cliente** (activación self-serve), desintermediando a la agencia en esas activaciones.

## Contexto tecnológico (build vs. integrate)

La infraestructura ya existe en ambos lados. Muchas **entidades deportivas** ya tienen herramientas de implementación: martech de **Salesforce** y **Adobe**, infraestructura de **Azure** y **Google**, y uso de sus **LLMs**. Las **marcas** están haciendo lo mismo.

**Implicación arquitectónica:** el producto **no reemplaza el stack martech** existente; se **integra y orquesta encima** de él. La mecánica de "data servida" y la activación self-serve se apoyan en esa infraestructura ya adoptada por entidad y marca. El producto es una **capa de inteligencia / orquestación**, no un nuevo silo.

## Restricciones no-negociables

- **Valor inmediato:** debe vender con urgencia hoy. Prometer "en 2 años estará resuelta la medición" = el CMO te despide.
- **Cero carga de datos al CMO:** si la plataforma exige que el CMO recolecte, conecte o suba la data, no resuelve su dolor — la carga de datos es parte del problema. La data **se sirve, no se pide**.

## Conexiones de síntesis clave

1. La muleta actual del CMO (AVE / visibilidad) es justo lo que el CFO rechaza → se gana reemplazándola.
2. "Cero carga de datos" se resuelve con la estructura de 3 jugadores: la entidad tiene datos + derechos, y la data se sirve desde la propiedad.
3. El pivote a copiloto es lo que hace posible la urgencia y el valor inmediato.
4. La estrella polar de precisión solo es entregable con **first-party data del fan** que tiene la propiedad, no la marca.
5. El copiloto tiene **dos dolores que atacar, no uno**: (a) demostrar/maximizar ROI con datos, y (b) comprimir el ciclo de activación marca-agencia. La IA generativa es la palanca común a ambos.

## Implicaciones para el Product Brief / preguntas abiertas

- **Modelo de negocio:** cómo se monetiza la relación consultor → entidad → marca (quién paga qué, cómo se reparte el valor de renovaciones/primas).
- **Fuentes de datos del fan:** qué first-party data tiene la propiedad y cómo habilita la precisión (mensaje/momento/forma/persona correcta).
- **Catálogo de activaciones:** qué activaciones explota el copiloto para maximizar ROI y cómo se conectan a datos.
- **Mecánica de "data servida":** cómo se sirve la data desde la propiedad sin imponer carga al CMO.
- **Estrategia de integración:** qué conectores/integraciones priorizar (Salesforce, Adobe, Azure, Google y sus LLMs) para orquestar sobre el stack existente en vez de duplicarlo; modelo LLM propio vs. el del cliente.
- **Ciclo de activación / autonomía:** cómo el copiloto comprime el flujo identificar → crear → aprobar → implementar y habilita la **autonomía de implementación del cliente** (la agencia sale del loop cuando el cliente puede implementar solo). Definir el grado de self-serve y qué se automatiza vs. qué requiere aprobación.
- **MVP:** qué entrega valor inmediato y construye la escena héroe ante el board desde el día uno.
