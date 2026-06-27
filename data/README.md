# `data/` — Esquemas Supabase (Postgres)

Dos **dominios de datos separados** (AD-3 — frontera de datos):

| Dominio | Carpeta | PII | Plano |
|---|---|---|---|
| Inteligencia Pública | `inteligencia-publica/` | **Nunca** | Ligero |
| Clean Room | `clean-room/` | Sí — **aislado** | Profundo |

La PII del fan vive **solo** en el Clean Room. Nunca cruza al plano ligero ni a la Marca; solo cruzan **segmentos agregados/anonimizados** que cumplen el contrato de AD-8 (k-mínimo, sin identificadores por-fan). El Clean Room exige aislamiento reforzado por Propiedad (Historia 4.1).

## Migraciones

| Archivo | Qué establece | Historia |
|---|---|---|
| `migrations/0001_rbac_basico.sql` | Roles (`rol_usuario`), tenancy (`propiedades`, `marcas`), `perfiles` y RLS básico por rol/tenant (AD-9) | 1.1 |

### Cómo aplicarlas

Estas migraciones se aplican sobre el proyecto Supabase (gestionado). Con credenciales configuradas (`.env`), vía el SQL editor de Supabase o el CLI:

```bash
# con supabase CLI vinculado al proyecto
supabase db push   # o ejecutar el .sql en el SQL editor
```

> Convenciones del spine: IDs `uuid` v4, fechas ISO-8601 UTC, escritura a eventos de valor **append-only** (AD-4, se introduce en la Épica 5).
