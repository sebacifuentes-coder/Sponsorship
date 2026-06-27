/**
 * Roles del dominio — RBAC básico de los 3 actores (AD-9).
 *
 * Definición canónica de los tres jugadores del modelo (PRD §Glosario):
 *  - Consultor: construye/provee y opera el Copiloto (vista multi-cliente).
 *  - Propiedad: club/liga/federación; paga, distribuye, aporta datos+derechos.
 *  - Marca:     empresa patrocinadora; su CMO es el usuario final.
 *
 * Esto es dominio puro: sin framework ni proveedores (AD-2).
 * La frontera técnica que *hace cumplir* estos roles a nivel de fila es el
 * Row Level Security de Supabase (AD-9); ver `data/migrations`. El RLS
 * reforzado del Clean Room se aborda en la Historia 4.1.
 */

export const ROLES = ['consultor', 'propiedad', 'marca'] as const;

export type Rol = (typeof ROLES)[number];

export function esRolValido(valor: unknown): valor is Rol {
  return typeof valor === 'string' && (ROLES as readonly string[]).includes(valor);
}

/**
 * Capacidades del RBAC básico. Matriz mínima de la Historia 1.1; se endurece
 * con RLS por Propiedad y aislamiento reforzado del Clean Room (Historia 4.1).
 *
 * Invariante de privacidad (AD-3): la Marca NUNCA puede leer PII del Clean Room.
 */
export type Capacidad =
  | 'ver:oportunidades'
  | 'gestionar:contexto-marca'
  | 'generar:activacion'
  | 'aprobar:activacion'
  | 'gestionar:propiedad'
  | 'gestionar:datos-fan'
  | 'leer:pii-clean-room'
  | 'auditar:valor';

const CAPACIDADES_POR_ROL: Record<Rol, readonly Capacidad[]> = {
  // El Consultor opera el servicio de forma multi-cliente.
  consultor: [
    'ver:oportunidades',
    'gestionar:contexto-marca',
    'generar:activacion',
    'aprobar:activacion',
    'gestionar:propiedad',
    'gestionar:datos-fan',
    'auditar:valor',
  ],
  // La Propiedad gestiona sus marcas, derechos y fuentes de datos del fan.
  propiedad: [
    'ver:oportunidades',
    'gestionar:contexto-marca',
    'gestionar:propiedad',
    'gestionar:datos-fan',
    'auditar:valor',
  ],
  // La Marca (CMO) consume el plano ligero; jamás accede a PII del Clean Room (AD-3).
  marca: [
    'ver:oportunidades',
    'gestionar:contexto-marca',
    'generar:activacion',
    'aprobar:activacion',
  ],
};

export function puede(rol: Rol, capacidad: Capacidad): boolean {
  return CAPACIDADES_POR_ROL[rol].includes(capacidad);
}
