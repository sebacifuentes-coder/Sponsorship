-- =============================================================================
-- 0007_contexto_adicional.sql — Contexto adicional de la Marca (AD-7, AD-9)
-- =============================================================================
-- Historia 2.4 (FR-18) — Contexto adicional por Marca: audiencia objetivo,
-- calendario, productos/mensajes, restricciones de marca y mercados. Cuarto
-- bloque del Contexto de marca y patrocinio (PRD §4.9). Captura PROGRESIVA:
-- todos los campos opcionales; no bloquea el primer valor.
--
-- AD-7: módulo dueño `core/context`; un registro por Marca (upsert).
-- AD-9: RLS multi-tenant por Propiedad. Contexto de negocio, no PII del fan.
-- =============================================================================

create table if not exists contexto_adicional (
  marca_id            uuid primary key references marcas (id) on delete cascade,
  propiedad_id        uuid not null references propiedades (id) on delete cascade,
  audiencia_objetivo  text not null default '',
  calendario          text not null default '',
  productos_mensajes  text not null default '',
  restricciones_marca text not null default '',
  mercados            text not null default '',
  actualizado_en      timestamptz not null default now()
);

create index if not exists contexto_adicional_propiedad_idx
  on contexto_adicional (propiedad_id);

-- --- RLS: multi-tenant por Propiedad (AD-9) ----------------------------------
alter table contexto_adicional enable row level security;

drop policy if exists contexto_adicional_select on contexto_adicional;
create policy contexto_adicional_select on contexto_adicional
  for select using (rol_actual() = 'consultor' or propiedad_id = propiedad_actual());

drop policy if exists contexto_adicional_insert on contexto_adicional;
create policy contexto_adicional_insert on contexto_adicional
  for insert with check (rol_actual() = 'consultor' or propiedad_id = propiedad_actual());

drop policy if exists contexto_adicional_update on contexto_adicional;
create policy contexto_adicional_update on contexto_adicional
  for update using (rol_actual() = 'consultor' or propiedad_id = propiedad_actual());
