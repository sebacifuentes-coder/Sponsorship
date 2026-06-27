-- =============================================================================
-- 0001_rbac_basico.sql — Identidad, roles y multi-tenant por Propiedad (AD-9)
-- =============================================================================
-- Historia 1.1 — RBAC básico de los 3 actores (Consultor, Propiedad, Marca) +
-- aislamiento multi-tenant por Propiedad, con Row Level Security de Supabase
-- como frontera técnica.
--
-- Alcance de esta migración (baseline):
--   * Enum de rol y tablas de tenancy (propiedades, marcas).
--   * Tabla `perfiles` que vincula auth.users → rol + tenant.
--   * RLS habilitado en todas las tablas con políticas básicas por rol/tenant.
--
-- Fuera de alcance aquí (Historia 4.1):
--   * Dominio de datos del Clean Room (first-party PII) con RLS REFORZADO.
--     AD-3: la PII nunca cruza al plano ligero ni a la Marca; el rol Marca
--     jamás puede leer filas del Clean Room. Eso se implementa en su esquema
--     aislado, no aquí.
-- =============================================================================

-- --- Roles del dominio (espejo de core/shared/roles.ts) -----------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'rol_usuario') then
    create type rol_usuario as enum ('consultor', 'propiedad', 'marca');
  end if;
end$$;

-- --- Tenancy: Propiedad y Marca ----------------------------------------------
create table if not exists propiedades (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  created_at  timestamptz not null default now()
);

create table if not exists marcas (
  id            uuid primary key default gen_random_uuid(),
  propiedad_id  uuid not null references propiedades (id) on delete cascade,
  nombre        text not null,
  created_at    timestamptz not null default now()
);

-- --- Perfiles: vínculo auth.users → rol + tenant ------------------------------
create table if not exists perfiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  rol           rol_usuario not null,
  propiedad_id  uuid references propiedades (id) on delete set null,
  marca_id      uuid references marcas (id) on delete set null,
  created_at    timestamptz not null default now(),
  -- Coherencia de tenant por rol:
  --   propiedad → debe tener propiedad_id; marca → propiedad_id + marca_id;
  --   consultor → multi-cliente, sin tenant fijo.
  constraint perfil_tenant_coherente check (
    (rol = 'consultor')
    or (rol = 'propiedad' and propiedad_id is not null)
    or (rol = 'marca' and propiedad_id is not null and marca_id is not null)
  )
);

-- --- Helpers de RLS (SECURITY DEFINER para evitar recursión en políticas) -----
create or replace function rol_actual()
returns rol_usuario
language sql stable security definer set search_path = public as $$
  select rol from perfiles where id = auth.uid()
$$;

create or replace function propiedad_actual()
returns uuid
language sql stable security definer set search_path = public as $$
  select propiedad_id from perfiles where id = auth.uid()
$$;

-- --- RLS: habilitar ----------------------------------------------------------
alter table perfiles    enable row level security;
alter table propiedades enable row level security;
alter table marcas      enable row level security;

-- perfiles: cada quien lee su propio perfil; el Consultor ve todos.
drop policy if exists perfiles_select on perfiles;
create policy perfiles_select on perfiles
  for select using (id = auth.uid() or rol_actual() = 'consultor');

-- propiedades: el Consultor ve todas; Propiedad/Marca solo la suya (multi-tenant).
drop policy if exists propiedades_select on propiedades;
create policy propiedades_select on propiedades
  for select using (rol_actual() = 'consultor' or id = propiedad_actual());

-- marcas: el Consultor ve todas; el resto, las marcas de su Propiedad.
drop policy if exists marcas_select on marcas;
create policy marcas_select on marcas
  for select using (rol_actual() = 'consultor' or propiedad_id = propiedad_actual());

-- Nota: las políticas de escritura (insert/update/delete) por rol se añaden a
-- medida que cada épica introduce sus casos de uso. AD-7: la mutación de estado
-- de dominio ocurre solo vía core/, no por escritura directa de adaptadores.
