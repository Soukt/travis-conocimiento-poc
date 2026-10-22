export class ErrorDeAlmacen extends Error {}

export type Cambio = { ruta: string; contenido: string | null };
export type Firma = { nombre: string; email: string };
export type EntradaHistorial = { commit: string; version: number | null; autor: string; fecha: string; mensaje: string };

export interface AlmacenConocimiento {
  inicializar(semilla: ReadonlyMap<string, string>, firma: Firma): Promise<void>;
  cabeza(ref: string): Promise<string>;
  versionPublicada(): Promise<{ version: number; commit: string }>;
  leerArbol(ref: string): Promise<Map<string, string>>;
  leer(ruta: string, ref: string): Promise<string | null>;
  crearRama(rama: string, base: string, cambios: Cambio[], firma: Firma, mensaje: string): Promise<{ commit: string; ficheros: string[] }>;
  diferencias(desde: string, hasta: string, ruta?: string): Promise<string>;
  publicar(rama: string, firma: Firma, mensaje: string): Promise<{ commit: string; version: number }>;
  historial(ruta?: string): Promise<EntradaHistorial[]>;
}
