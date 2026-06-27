/**
 * Contrato del repositorio de Contexto de marca (AD-7).
 *
 * `core/context` es el módulo dueño del contexto de marca y patrocinio: define
 * el contrato de persistencia, pero no conoce el proveedor (Supabase). La
 * implementación concreta vive en `lib/repositories` (Supabase) y se inyecta en
 * el borde. El dominio nunca importa el proveedor.
 */

import type { MarcaId, PropiedadId } from '@/core/shared/tenant';
import type { DerechoContratado, DerechoEntrada } from '@/core/context/derecho';
import type { AdnEntrada, AdnMarca } from '@/core/context/adn-marca';
import type { ObjetivoComunicacion } from '@/core/context/objetivos';
import type {
  ContextoAdicional,
  ContextoAdicionalEntrada,
} from '@/core/context/contexto-adicional';

export interface RepositorioDerechos {
  /** Lista los derechos contratados de una Marca. */
  listarDerechos(marcaId: MarcaId): Promise<DerechoContratado[]>;
  /**
   * Reemplaza el catálogo completo de derechos de una Marca por el conjunto
   * dado (operación idempotente: registrar/editar el catálogo en un paso).
   * Devuelve el catálogo resultante. AD-7: muta el estado de dominio aquí.
   */
  reemplazarDerechos(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    entradas: DerechoEntrada[],
  ): Promise<DerechoContratado[]>;
}

/**
 * Implementación en memoria — pura, sin proveedor. Sirve para tests y para el
 * modo demo local cuando Supabase aún no está configurado (AD-1: la app corre
 * sin credenciales).
 */
export class RepositorioDerechosEnMemoria implements RepositorioDerechos {
  private readonly porMarca = new Map<MarcaId, DerechoContratado[]>();

  /** Reloj inyectable para tests; por defecto el del sistema (ISO-8601 UTC). */
  constructor(private readonly ahora: () => string = () => new Date().toISOString()) {}

  async listarDerechos(marcaId: MarcaId): Promise<DerechoContratado[]> {
    return (this.porMarca.get(marcaId) ?? []).map((d) => ({ ...d }));
  }

  async reemplazarDerechos(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    entradas: DerechoEntrada[],
  ): Promise<DerechoContratado[]> {
    const registradoEn = this.ahora();
    const derechos: DerechoContratado[] = entradas.map((e) => ({
      id: crypto.randomUUID(),
      marcaId,
      propiedadId,
      tipo: e.tipo,
      descripcion: e.descripcion && e.descripcion.length > 0 ? e.descripcion : null,
      activo: e.activo,
      registradoEn,
    }));
    this.porMarca.set(marcaId, derechos);
    return derechos.map((d) => ({ ...d }));
  }
}

export interface RepositorioAdnMarca {
  /** Devuelve el ADN vigente de una Marca, o null si aún no se ha capturado. */
  obtenerAdn(marcaId: MarcaId): Promise<AdnMarca | null>;
  /** Guarda (upsert) el ADN de una Marca. AD-7: muta el estado de dominio aquí. */
  guardarAdn(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    entrada: AdnEntrada,
  ): Promise<AdnMarca>;
}

/** Implementación en memoria del ADN de marca (tests / demo local — AD-1). */
export class RepositorioAdnMarcaEnMemoria implements RepositorioAdnMarca {
  private readonly porMarca = new Map<MarcaId, AdnMarca>();

  constructor(private readonly ahora: () => string = () => new Date().toISOString()) {}

  async obtenerAdn(marcaId: MarcaId): Promise<AdnMarca | null> {
    const adn = this.porMarca.get(marcaId);
    return adn ? { ...adn } : null;
  }

  async guardarAdn(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    entrada: AdnEntrada,
  ): Promise<AdnMarca> {
    const adn: AdnMarca = {
      marcaId,
      propiedadId,
      valores: entrada.valores,
      tonoVoz: entrada.tonoVoz,
      identidadVisual: entrada.identidadVisual,
      posicionamiento: entrada.posicionamiento,
      origen: entrada.origen,
      actualizadoEn: this.ahora(),
    };
    this.porMarca.set(marcaId, adn);
    return { ...adn };
  }
}

/** Objetivos de comunicación vigentes de una Marca (Historia 2.3). */
export interface ObjetivosMarca {
  marcaId: MarcaId;
  propiedadId: PropiedadId;
  objetivos: ObjetivoComunicacion[];
  actualizadoEn: string;
}

export interface RepositorioObjetivos {
  /** Objetivos vigentes de una Marca (lista vacía si no se han registrado). */
  obtenerObjetivos(marcaId: MarcaId): Promise<ObjetivosMarca | null>;
  /** Guarda (upsert) los objetivos vigentes. AD-7: muta el estado aquí. */
  guardarObjetivos(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    objetivos: ObjetivoComunicacion[],
  ): Promise<ObjetivosMarca>;
}

/** Implementación en memoria de objetivos (tests / demo local — AD-1). */
export class RepositorioObjetivosEnMemoria implements RepositorioObjetivos {
  private readonly porMarca = new Map<MarcaId, ObjetivosMarca>();

  constructor(private readonly ahora: () => string = () => new Date().toISOString()) {}

  async obtenerObjetivos(marcaId: MarcaId): Promise<ObjetivosMarca | null> {
    const o = this.porMarca.get(marcaId);
    return o ? { ...o, objetivos: [...o.objetivos] } : null;
  }

  async guardarObjetivos(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    objetivos: ObjetivoComunicacion[],
  ): Promise<ObjetivosMarca> {
    const registro: ObjetivosMarca = {
      marcaId,
      propiedadId,
      objetivos: [...objetivos],
      actualizadoEn: this.ahora(),
    };
    this.porMarca.set(marcaId, registro);
    return { ...registro, objetivos: [...registro.objetivos] };
  }
}

export interface RepositorioContextoAdicional {
  /** Contexto adicional de una Marca, o null si no se ha capturado. */
  obtenerContexto(marcaId: MarcaId): Promise<ContextoAdicional | null>;
  /** Guarda (upsert) el contexto adicional. AD-7: muta el estado aquí. */
  guardarContexto(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    entrada: ContextoAdicionalEntrada,
  ): Promise<ContextoAdicional>;
}

/** Implementación en memoria del contexto adicional (tests / demo — AD-1). */
export class RepositorioContextoAdicionalEnMemoria implements RepositorioContextoAdicional {
  private readonly porMarca = new Map<MarcaId, ContextoAdicional>();

  constructor(private readonly ahora: () => string = () => new Date().toISOString()) {}

  async obtenerContexto(marcaId: MarcaId): Promise<ContextoAdicional | null> {
    const ctx = this.porMarca.get(marcaId);
    return ctx ? { ...ctx } : null;
  }

  async guardarContexto(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    entrada: ContextoAdicionalEntrada,
  ): Promise<ContextoAdicional> {
    const ctx: ContextoAdicional = {
      marcaId,
      propiedadId,
      ...entrada,
      actualizadoEn: this.ahora(),
    };
    this.porMarca.set(marcaId, ctx);
    return { ...ctx };
  }
}
