# `adapters/` — Implementaciones de los puertos (hexagonal)

Adaptadores que implementan los contratos de `ports/` para un proveedor concreto. **Los adaptadores ejecutan, no deciden** (AD-7): nunca mutan estado de dominio directo — lo hacen vía un caso de uso de `core/` o escriben a una tabla de *staging* propia que `core/` promueve.

| Carpeta | Implementa | Proveedor(es) | Épica |
|---|---|---|---|
| `llm/` | `LlmPort` | Azure OpenAI / Google (vía Vercel AI SDK) | 3 (Historia 3.1) |
| `martech/` | `MartechPort` | Salesforce / Adobe | 3 |
| `publicdata/` | `PublicDataPort` | Fuentes públicas (club + hincha) | 1–4 |
| `cleanroom/` | `CleanRoomPort` | Clean Room (first-party PII, aislado) | 4 |

Regla de dirección de dependencias: `adapters/ → ports/ → core/`. El núcleo no depende de adaptadores.

> Historia 1.1 deja la estructura. Cada adaptador entra detrás de su puerto en la épica correspondiente.
