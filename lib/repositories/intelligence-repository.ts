/**
 * Implementación Supabase del Almacén de Inteligencia Pública (AD-7, AD-9).
 *
 * `core/intelligence` define el contrato; aquí vive la implementación con el
 * proveedor. Se inyecta en el borde (route handler / worker). El núcleo nunca
 * importa este archivo. Tabla: `senales_publicas` (data/migrations/0002).
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { PropiedadId } from '@/core/shared/tenant';
import type { SenalPublica } from '@/core/intelligence/senal';
import type { AlmacenInteligenciaPublica } from '@/core/intelligence/repository';

interface FilaSenal {
  id: string;
  propiedad_id: string;
  categoria: string;
  clave: string;
  etiqueta: string;
  valor: number;
  unidad: string;
  tamano_cohorte: number;
  fuente: string;
  periodo: string;
  ingestado_en: string;
}

function aFila(s: SenalPublica): FilaSenal {
  return {
    id: s.id,
    propiedad_id: s.propiedadId,
    categoria: s.categoria,
    clave: s.clave,
    etiqueta: s.etiqueta,
    valor: s.valor,
    unidad: s.unidad,
    tamano_cohorte: s.tamanoCohorte,
    fuente: s.fuente,
    periodo: s.periodo,
    ingestado_en: s.ingestadoEn,
  };
}

function aDominio(f: FilaSenal): SenalPublica {
  return {
    id: f.id,
    propiedadId: f.propiedad_id,
    categoria: f.categoria as SenalPublica['categoria'],
    clave: f.clave,
    etiqueta: f.etiqueta,
    valor: f.valor,
    unidad: f.unidad,
    tamanoCohorte: f.tamano_cohorte,
    fuente: f.fuente,
    periodo: f.periodo,
    ingestadoEn: f.ingestado_en,
  };
}

export class SupabaseAlmacenInteligenciaPublica implements AlmacenInteligenciaPublica {
  constructor(private readonly supabase: SupabaseClient) {}

  async guardarSenales(senales: SenalPublica[]): Promise<void> {
    if (senales.length === 0) return;
    const { error } = await this.supabase
      .from('senales_publicas')
      .insert(senales.map(aFila));
    if (error) {
      throw new Error(`No se pudieron guardar las señales públicas: ${error.message}`);
    }
  }

  async listarSenales(propiedadId: PropiedadId): Promise<SenalPublica[]> {
    const { data, error } = await this.supabase
      .from('senales_publicas')
      .select('*')
      .eq('propiedad_id', propiedadId)
      .order('ingestado_en', { ascending: false });
    if (error) {
      throw new Error(`No se pudieron leer las señales públicas: ${error.message}`);
    }
    return (data as FilaSenal[]).map(aDominio);
  }
}
