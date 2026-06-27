-- =============================================================================
-- 0004_contexto_derechos.sql — Derechos contratados del patrocinio (AD-7, AD-9)
-- =============================================================================
-- Historia 2.1 (FR-15) — Catálogo de Derechos contratados por Marca. Primer
-- bloque del Contexto de marca y patrocinio (PRD §4.9) que personaliza el motor
-- de oportunidades: una Oportunidad solo se propone sobre derechos efectivamente
-- contratados.
--
-- AD-7: el módulo dueño de esta entidad es `core/context`; la mutación de estado
-- ocurre vía sus casos de uso, no por escritura directa de adaptadores.
-- AD-9: RLS multi-tenant por Propiedad. Estos NO son datos del fan ni PII; el
-- catálogo de derechos es contexto de negocio (la frontera dura de PII es el
-- Clean Room, Épica 4).
-- =============================================================================

create table if not exists derechos_contratados (
  id            uuid primary key default gen_random_uuid(),
  marca_id      uuid not null references marcas (id) on delete cascade,
  propiedad_id  uuid not null references propiedades (id) on delete cascade,
  tipo          text not null check (tipo in (
                  'camiseta', 'led_perimetral', 'hospitality', 'contenido_digital',
                  'social_oficial', 'datos_audiencia', 'naming', 'presencia_estadio',
                  'experiencias_fan', 'newsletter'
                )),
  descripcion   text,
  activo        boolean not null default true,
  registrado_en timestamptz not null default now()
);

create index if not exists derechos_contratados_marca_idx
  on derechos_contratados (marca_id);

-- --- RLS: multi-tenant por Propiedad (AD-9) ----------------------------------
alter table derechos_contratados enable row level security;

-- Lectura: el Consultor ve todo; Propiedad/Marca solo las de su Propiedad.
-- (El catálogo de derechos no es PII; la Marca puede leer los suyos.)
drop policy if exists derechos_contratados_select on derechos_contratados;
create policy derechos_contratados_select on derechos_contratados
  for select using (rol_actual() = 'consultor' or propiedad_id = propiedad_actual());

-- Gestión (insert/update/delete): solo Consultor o la propia Propiedad (FR-15).
-- La Marca NO gestiona su propio catálogo de derechos; los aporta la Propiedad.
drop policy if exists derechos_contratados_insert on derechos_contratados;
create policy derechos_contratados_insert on derechos_contratados
  for insert with check (
    rol_actual() = 'consultor' or propiedad_id = propiedad_actual()
  );

drop policy if exists derechos_contratados_update on derechos_contratados;
create policy derechos_contratados_update on derechos_contratados
  for update using (
    rol_actual() = 'consultor' or propiedad_id = propiedad_actual()
  );

drop policy if exists derechos_contratados_delete on derechos_contratados;
create policy derechos_contratados_delete on derechos_contratados
  for delete using (
    rol_actual() = 'consultor' or propiedad_id = propiedad_actual()
  );
