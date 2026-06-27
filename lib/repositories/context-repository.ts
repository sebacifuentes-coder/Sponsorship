/**
 * Implementación Supabase del repositorio de Contexto de marca (AD-7, AD-9).
 *
 * `core/context` define el contrato; aquí vive la implementación con el
 * proveedor. Se inyecta en el borde (route handler). El núcleo nunca importa
 * este archivo. Tabla: `derechos_contratados` (data/migrations/0004).
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { MarcaId, PropiedadId } from '@/core/shared/tenant';
import type {
  ContextoAdicional,
  ContextoAdicionalEntrada,
  ObjetivosMarca,
  RepositorioAdnMarca,
  RepositorioContextoAdicional,
  RepositorioDerechos,
  RepositorioObjetivos,
} from '@/core/context';
import {
  type AdnEntrada,
  type AdnMarca,
  type DerechoContratado,
  type DerechoEntrada,
  type ObjetivoComunicacion,
  esObjetivoComunicacion,
  esTipoDerecho,
} from '@/core/context';

interface FilaDerecho {
  id: string;
  marca_id: string;
  propiedad_id: string;
  tipo: string;
  descripcion: string | null;
  activo: boolean;
  registrado_en: string;
}

function aDominio(f: FilaDerecho): DerechoContratado {
  if (!esTipoDerecho(f.tipo)) {
    throw new Error(`Tipo de derecho desconocido en BD: ${f.tipo}`);
  }
  return {
    id: f.id,
    marcaId: f.marca_id,
    propiedadId: f.propiedad_id,
    tipo: f.tipo,
    descripcion: f.descripcion,
    activo: f.activo,
    registradoEn: f.registrado_en,
  };
}

export class SupabaseRepositorioDerechos implements RepositorioDerechos {
  constructor(private readonly supabase: SupabaseClient) {}

  async listarDerechos(marcaId: MarcaId): Promise<DerechoContratado[]> {
    const { data, error } = await this.supabase
      .from('derechos_contratados')
      .select('*')
      .eq('marca_id', marcaId)
      .order('registrado_en', { ascending: false });
    if (error) {
      throw new Error(`No se pudieron leer los derechos contratados: ${error.message}`);
    }
    return (data as FilaDerecho[]).map(aDominio);
  }

  async reemplazarDerechos(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    entradas: DerechoEntrada[],
  ): Promise<DerechoContratado[]> {
    // Reemplazo del catálogo de la Marca: borra el set previo y vuelve a insertar.
    const { error: errorBorrado } = await this.supabase
      .from('derechos_contratados')
      .delete()
      .eq('marca_id', marcaId);
    if (errorBorrado) {
      throw new Error(`No se pudo limpiar el catálogo de derechos: ${errorBorrado.message}`);
    }

    if (entradas.length === 0) return [];

    const filas = entradas.map((e) => ({
      marca_id: marcaId,
      propiedad_id: propiedadId,
      tipo: e.tipo,
      descripcion: e.descripcion && e.descripcion.length > 0 ? e.descripcion : null,
      activo: e.activo,
    }));

    const { data, error } = await this.supabase
      .from('derechos_contratados')
      .insert(filas)
      .select('*');
    if (error) {
      throw new Error(`No se pudieron guardar los derechos contratados: ${error.message}`);
    }
    return (data as FilaDerecho[]).map(aDominio);
  }
}

interface FilaAdn {
  marca_id: string;
  propiedad_id: string;
  valores: string[];
  tono_voz: string;
  identidad_visual: string;
  posicionamiento: string;
  origen: string;
  actualizado_en: string;
}

function adnADominio(f: FilaAdn): AdnMarca {
  return {
    marcaId: f.marca_id,
    propiedadId: f.propiedad_id,
    valores: f.valores ?? [],
    tonoVoz: f.tono_voz,
    identidadVisual: f.identidad_visual,
    posicionamiento: f.posicionamiento,
    origen: f.origen === 'borrador-ia' ? 'borrador-ia' : 'editado-usuario',
    actualizadoEn: f.actualizado_en,
  };
}

export class SupabaseRepositorioAdnMarca implements RepositorioAdnMarca {
  constructor(private readonly supabase: SupabaseClient) {}

  async obtenerAdn(marcaId: MarcaId): Promise<AdnMarca | null> {
    const { data, error } = await this.supabase
      .from('adn_marca')
      .select('*')
      .eq('marca_id', marcaId)
      .maybeSingle();
    if (error) {
      throw new Error(`No se pudo leer el ADN de marca: ${error.message}`);
    }
    return data ? adnADominio(data as FilaAdn) : null;
  }

  async guardarAdn(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    entrada: AdnEntrada,
  ): Promise<AdnMarca> {
    const fila = {
      marca_id: marcaId,
      propiedad_id: propiedadId,
      valores: entrada.valores,
      tono_voz: entrada.tonoVoz,
      identidad_visual: entrada.identidadVisual,
      posicionamiento: entrada.posicionamiento,
      origen: entrada.origen,
      actualizado_en: new Date().toISOString(),
    };
    const { data, error } = await this.supabase
      .from('adn_marca')
      .upsert(fila, { onConflict: 'marca_id' })
      .select('*')
      .single();
    if (error) {
      throw new Error(`No se pudo guardar el ADN de marca: ${error.message}`);
    }
    return adnADominio(data as FilaAdn);
  }
}

interface FilaObjetivos {
  marca_id: string;
  propiedad_id: string;
  objetivos: string[];
  actualizado_en: string;
}

function objetivosADominio(f: FilaObjetivos): ObjetivosMarca {
  return {
    marcaId: f.marca_id,
    propiedadId: f.propiedad_id,
    objetivos: (f.objetivos ?? []).filter(esObjetivoComunicacion),
    actualizadoEn: f.actualizado_en,
  };
}

export class SupabaseRepositorioObjetivos implements RepositorioObjetivos {
  constructor(private readonly supabase: SupabaseClient) {}

  async obtenerObjetivos(marcaId: MarcaId): Promise<ObjetivosMarca | null> {
    const { data, error } = await this.supabase
      .from('objetivos_comunicacion')
      .select('*')
      .eq('marca_id', marcaId)
      .maybeSingle();
    if (error) {
      throw new Error(`No se pudieron leer los objetivos: ${error.message}`);
    }
    return data ? objetivosADominio(data as FilaObjetivos) : null;
  }

  async guardarObjetivos(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    objetivos: ObjetivoComunicacion[],
  ): Promise<ObjetivosMarca> {
    const fila = {
      marca_id: marcaId,
      propiedad_id: propiedadId,
      objetivos,
      actualizado_en: new Date().toISOString(),
    };
    const { data, error } = await this.supabase
      .from('objetivos_comunicacion')
      .upsert(fila, { onConflict: 'marca_id' })
      .select('*')
      .single();
    if (error) {
      throw new Error(`No se pudieron guardar los objetivos: ${error.message}`);
    }
    return objetivosADominio(data as FilaObjetivos);
  }
}

interface FilaContexto {
  marca_id: string;
  propiedad_id: string;
  audiencia_objetivo: string;
  calendario: string;
  productos_mensajes: string;
  restricciones_marca: string;
  mercados: string;
  actualizado_en: string;
}

function contextoADominio(f: FilaContexto): ContextoAdicional {
  return {
    marcaId: f.marca_id,
    propiedadId: f.propiedad_id,
    audienciaObjetivo: f.audiencia_objetivo,
    calendario: f.calendario,
    productosMensajes: f.productos_mensajes,
    restriccionesMarca: f.restricciones_marca,
    mercados: f.mercados,
    actualizadoEn: f.actualizado_en,
  };
}

export class SupabaseRepositorioContextoAdicional implements RepositorioContextoAdicional {
  constructor(private readonly supabase: SupabaseClient) {}

  async obtenerContexto(marcaId: MarcaId): Promise<ContextoAdicional | null> {
    const { data, error } = await this.supabase
      .from('contexto_adicional')
      .select('*')
      .eq('marca_id', marcaId)
      .maybeSingle();
    if (error) {
      throw new Error(`No se pudo leer el contexto adicional: ${error.message}`);
    }
    return data ? contextoADominio(data as FilaContexto) : null;
  }

  async guardarContexto(
    marcaId: MarcaId,
    propiedadId: PropiedadId,
    entrada: ContextoAdicionalEntrada,
  ): Promise<ContextoAdicional> {
    const fila = {
      marca_id: marcaId,
      propiedad_id: propiedadId,
      audiencia_objetivo: entrada.audienciaObjetivo,
      calendario: entrada.calendario,
      productos_mensajes: entrada.productosMensajes,
      restricciones_marca: entrada.restriccionesMarca,
      mercados: entrada.mercados,
      actualizado_en: new Date().toISOString(),
    };
    const { data, error } = await this.supabase
      .from('contexto_adicional')
      .upsert(fila, { onConflict: 'marca_id' })
      .select('*')
      .single();
    if (error) {
      throw new Error(`No se pudo guardar el contexto adicional: ${error.message}`);
    }
    return contextoADominio(data as FilaContexto);
  }
}
