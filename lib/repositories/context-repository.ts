/**
 * Implementación Supabase del repositorio de Contexto de marca (AD-7, AD-9).
 *
 * `core/context` define el contrato; aquí vive la implementación con el
 * proveedor. Se inyecta en el borde (route handler). El núcleo nunca importa
 * este archivo. Tabla: `derechos_contratados` (data/migrations/0004).
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { MarcaId, PropiedadId } from '@/core/shared/tenant';
import type { RepositorioDerechos } from '@/core/context';
import { type DerechoContratado, type DerechoEntrada, esTipoDerecho } from '@/core/context';

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
