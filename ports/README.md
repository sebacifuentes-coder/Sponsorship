# `ports/` — Contratos internos hacia lo externo

Puertos (interfaces) que el núcleo usa para hablar con el mundo exterior **sin conocer al proveedor** (AD-5). El núcleo nunca llama al SDK de un proveedor: lo hace siempre vía un puerto con contrato interno estable. Añadir o cambiar un proveedor no toca `core/`.

## Convenciones (spine)

- Las interfaces de puerto llevan sufijo `Port` (`LlmPort`, `MartechPort`, `PublicDataPort`, `CleanRoomPort`).
- Todo puerto que produzca **efectos externos** (publicar activación, sincronizar) usa **claves de idempotencia** y es seguro ante reintentos (AD-5).
- El puerto del Clean Room valida en runtime el contrato de segmento agregado y **rechaza** cualquier payload bajo umbral o con identificadores por-fan (AD-8).

> Los puertos concretos se introducen con su épica: `LlmPort` en la Historia 3.1; `MartechPort` en la Épica 3; `CleanRoomPort` / `PublicDataPort` en la Épica 4.
