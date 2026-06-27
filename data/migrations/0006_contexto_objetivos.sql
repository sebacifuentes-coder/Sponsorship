-- =============================================================================
-- 0006_contexto_objetivos.sql — Objetivos de comunicación (AD-7, AD-9)
-- =============================================================================
-- Historia 2.3 (FR-17) — Objetivos de comunicación vigentes por Marca. Tercer
-- bloque del Contexto de marca y patrocinio (PRD §4.9): orientan la priorización
-- de oportunidades (Historia 1.4).
--
-- AD-7: el módulo dueño es `core/context`; un registro por Marca (upsert).
-- AD-9: RLS multi-tenant por Propiedad. Contexto de negocio, no PII del fan.
-- =============================================================================

create table if not exists objetivos_comunicacion (
  marca_id        uuid primary key references marcas (id) on delete cascade,
  propiedad_id    uuid not null references propiedades (id) on delete cascade,
  -- Subconjunto del catálogo canónico (core/context/objetivos.ts). Se valida en
  -- la frontera de la app; aquí se guarda como arreglo de texto.
  objetivos       text[] not null default '{}',
  actualizado_en  timestamptz not null default now()
);

create index if not exists objetivos_comunicacion_propiedad_idx
  on objetivos_comunicacion (propiedad_id);

-- --- RLS: multi-tenant por Propiedad (AD-9) ----------------------------------
alter table objetivos_comunicacion enable row level security;

-- Lectura: Consultor ve todo; Propiedad/Marca solo dentro de su Propiedad.
drop policy if exists objetivos_comunicacion_select on objetivos_comunicacion;
create policy objetivos_comunicacion_select on objetivos_comunicacion
  for select using (rol_actual() = 'consultor' or propiedad_id = propiedad_actual());

-- Gestión: el CMO de la Marca registra sus objetivos; también Consultor/Propiedad.
drop policy if exists objetivos_comunicacion_insert on objetivos_comunicacion;
create policy objetivos_comunicacion_insert on objetivos_comunicacion
  for insert with check (rol_actual() = 'consultor' or propiedad_id = propiedad_actual());

drop policy if exists objetivos_comunicacion_update on objetivos_comunicacion;
create policy objetivos_comunicacion_update on objetivos_comunicacion
  for update using (rol_actual() = 'consultor' or propiedad_id = propiedad_actual());
