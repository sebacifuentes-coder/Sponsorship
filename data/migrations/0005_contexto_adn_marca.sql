-- =============================================================================
-- 0005_contexto_adn_marca.sql — ADN de marca (AD-7, AD-9)
-- =============================================================================
-- Historia 2.2 (FR-16) — ADN de marca (valores, tono de voz, identidad visual,
-- posicionamiento) con pre-relleno asistido por IA. Segundo bloque del Contexto
-- de marca y patrocinio (PRD §4.9) que guía la generación creativa (Épica 3).
--
-- AD-7: el módulo dueño es `core/context`; un ADN por Marca (upsert).
-- AD-9: RLS multi-tenant por Propiedad. No es PII del fan; es contexto de marca.
-- =============================================================================

create table if not exists adn_marca (
  marca_id          uuid primary key references marcas (id) on delete cascade,
  propiedad_id      uuid not null references propiedades (id) on delete cascade,
  valores           text[] not null default '{}',
  tono_voz          text not null default '',
  identidad_visual  text not null default '',
  posicionamiento   text not null default '',
  -- Procedencia del ADN vigente: borrador propuesto por IA vs editado por persona.
  origen            text not null default 'editado-usuario'
                      check (origen in ('borrador-ia', 'editado-usuario')),
  actualizado_en    timestamptz not null default now()
);

create index if not exists adn_marca_propiedad_idx
  on adn_marca (propiedad_id);

-- --- RLS: multi-tenant por Propiedad (AD-9) ----------------------------------
alter table adn_marca enable row level security;

-- Lectura: Consultor ve todo; Propiedad/Marca solo dentro de su Propiedad.
drop policy if exists adn_marca_select on adn_marca;
create policy adn_marca_select on adn_marca
  for select using (rol_actual() = 'consultor' or propiedad_id = propiedad_actual());

-- Gestión: el CMO de la Marca captura su ADN; también Consultor/Propiedad.
-- (Todos los roles tienen 'gestionar:contexto-marca'; la barrera de tenant es el RLS.)
drop policy if exists adn_marca_insert on adn_marca;
create policy adn_marca_insert on adn_marca
  for insert with check (rol_actual() = 'consultor' or propiedad_id = propiedad_actual());

drop policy if exists adn_marca_update on adn_marca;
create policy adn_marca_update on adn_marca
  for update using (rol_actual() = 'consultor' or propiedad_id = propiedad_actual());
