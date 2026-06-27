-- =============================================================================
-- 0003_ttfv.sql — Eventos de Tiempo al Primer Valor (TTFV)
-- =============================================================================
-- Historia 1.5 — Instrumentación de la métrica TTFV (NFR-1, SM-5), invariante de
-- producto (spine §Observabilidad). Sin PII: solo medición del onboarding.
-- =============================================================================

create table if not exists ttfv_eventos (
  id                  uuid primary key default gen_random_uuid(),
  propiedad_id        uuid references propiedades (id) on delete set null,
  marca               text not null,
  objetivo            text not null,
  -- Invariante: el onboarding del primer valor es de ≤ 3 pasos.
  pasos               integer not null check (pasos between 1 and 3),
  duracion_ms         integer not null check (duracion_ms >= 0),
  dentro_del_objetivo boolean not null,
  creado_en           timestamptz not null default now()
);

create index if not exists ttfv_eventos_creado_idx on ttfv_eventos (creado_en);

-- RLS: lectura para Consultor (analítica del producto). La inserción la hace el
-- servidor; en producción se restringe por rol/servicio.
alter table ttfv_eventos enable row level security;

drop policy if exists ttfv_eventos_select on ttfv_eventos;
create policy ttfv_eventos_select on ttfv_eventos
  for select using (rol_actual() = 'consultor');
