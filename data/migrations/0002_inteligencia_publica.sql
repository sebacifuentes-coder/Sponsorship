-- =============================================================================
-- 0002_inteligencia_publica.sql — Almacén de Inteligencia Pública (AD-3)
-- =============================================================================
-- Historia 1.2 — Señales públicas AGREGADAS del club y del hincha, SIN PII.
--
-- AD-3 (frontera de datos): este es el dominio de datos del plano ligero. NUNCA
-- contiene PII; solo señales agregadas con su procedencia y fecha. El dominio
-- de datos del fan (first-party PII) vive aislado en el Clean Room (Épica 4) y
-- jamás comparte tabla con este almacén.
-- =============================================================================

create table if not exists senales_publicas (
  id              uuid primary key default gen_random_uuid(),
  propiedad_id    uuid not null references propiedades (id) on delete cascade,
  categoria       text not null check (categoria in (
                    'busqueda_intencion', 'consumo_canal',
                    'opinion_sentimiento', 'narrativa_social', 'sociodemografia'
                  )),
  clave           text not null,
  etiqueta        text not null,
  valor           double precision not null,
  unidad          text not null,
  -- Anti-perfilado (GDPR, PRD §16): toda señal describe una cohorte agregada.
  -- El umbral 50 refleja UMBRAL_AGREGACION en core/intelligence/senal.ts.
  tamano_cohorte  integer not null check (tamano_cohorte >= 50),
  -- Procedencia y fecha (AC de la Historia 1.2).
  fuente          text not null,
  periodo         text not null,
  ingestado_en    timestamptz not null default now()
);

create index if not exists senales_publicas_propiedad_idx
  on senales_publicas (propiedad_id, categoria);

-- --- RLS: multi-tenant por Propiedad (AD-9) ----------------------------------
alter table senales_publicas enable row level security;

-- Lectura: el Consultor ve todo; Propiedad/Marca solo las de su Propiedad.
-- (La Marca SÍ puede leer inteligencia pública agregada — no es PII; la frontera
--  dura contra PII es el Clean Room, no este almacén.)
drop policy if exists senales_publicas_select on senales_publicas;
create policy senales_publicas_select on senales_publicas
  for select using (rol_actual() = 'consultor' or propiedad_id = propiedad_actual());

-- Escritura (ingesta): Consultor o la propia Propiedad. La mutación de dominio
-- ocurre vía core/ (AD-7); esta política es la barrera de tenant a nivel de fila.
drop policy if exists senales_publicas_insert on senales_publicas;
create policy senales_publicas_insert on senales_publicas
  for insert with check (
    rol_actual() = 'consultor' or propiedad_id = propiedad_actual()
  );
