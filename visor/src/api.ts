"use client";

import { useCallback, useEffect, useState } from "react";

export type Usuario = { id: string; nombre: string; rol: string; esIA?: boolean };

export type TipoPieza = "formato" | "responsables" | "agente" | "area" | "caso" | "pruebas" | "informacion" | "aviso" | "plantilla" | "accion";

export type ResumenPieza = {
  ruta: string;
  tipo: TipoPieza;
  titulo: string;
  descripcion?: string;
  agente?: string;
  area?: string;
  caso?: string;
  modo?: string;
  desde?: string;
  hasta?: string;
};

export type Prueba = { pregunta: string; reserva?: string; mercado?: string; esperado: string };
export type Cita = { tipo: "accion" | "informacion" | "plantilla"; nombre: string; ruta: string; titulo: string; existe: boolean };

export type DetallePieza = ResumenPieza & {
  contenido: string;
  cabecera: Record<string, unknown> | null;
  cuerpo: string;
  responsables: string[];
  pruebas?: Prueba[];
  rutaPruebas?: string;
  rutaCaso?: string;
  citas: Cita[];
  citadaPor: ResumenPieza[];
};

export type EntradaDelIndice = { agente: string; area: string; titulo: string; descripcion: string; casos: number };
export type ResultadoDeBusqueda = ResumenPieza & { fragmento: string };
export type Problema = { ruta: string; mensaje: string };
export type Cambio = { ruta: string; contenido: string | null };

export type DatosPropuesta = {
  id: number;
  titulo: string;
  descripcion: string;
  autor: string;
  autorEsIA: boolean;
  origen: "visor" | "mcp";
  rama: string;
  base: string;
  ficheros: string[];
  creadaEn: string;
  estado: "abierta" | "publicada" | "rechazada";
  probadaPor?: string;
  probadaEn?: string;
  aprobaciones: Array<{ usuario: string; en: string }>;
  rechazo?: { usuario: string; motivo: string; en: string };
  version?: number;
  publicadaPor?: string;
  publicadaEn?: string;
};

export type FicheroDePropuesta = { ruta: string; cambio: "nuevo" | "cambiado" | "borrado"; diferencias: string; responsables: string[] };

export type DetallePropuesta = {
  propuesta: DatosPropuesta;
  ficheros: FicheroDePropuesta[];
  problemas: Problema[];
  pendientes: string[];
  pruebasAutomaticas: { disponible: false; motivo: string; casos: Array<{ caso: string; ruta: string; pruebas: number }> };
};

export type EntradaDeVersion = {
  version: number | null;
  commit: string;
  fecha: string;
  publicadaPor: string;
  mensaje: string;
  propuesta?: { id: number; titulo: string; autor: string; origen: string };
};

export class ErrorDeApi extends Error {
  constructor(
    mensaje: string,
    readonly estado: number,
  ) {
    super(mensaje);
  }
}

export async function pedir<T>(ruta: string, opciones: { metodo?: "GET" | "POST"; cuerpo?: unknown; usuario?: string } = {}): Promise<T> {
  const cabeceras: Record<string, string> = {};
  if (opciones.cuerpo !== undefined) cabeceras["content-type"] = "application/json";
  if (opciones.usuario) cabeceras["x-usuario"] = opciones.usuario;
  const respuesta = await fetch(`/api${ruta}`, {
    method: opciones.metodo ?? "GET",
    headers: cabeceras,
    body: opciones.cuerpo === undefined ? undefined : JSON.stringify(opciones.cuerpo),
    cache: "no-store",
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw new ErrorDeApi(datos.mensaje ?? `Error ${respuesta.status}`, respuesta.status);
  return datos as T;
}

const EVENTO_DE_CAMBIO = "travis:cambio";

// Avisa al resto de la página (versión, árbol, contador de propuestas) de que algo ha cambiado.
export function avisarDeCambio() {
  window.dispatchEvent(new Event(EVENTO_DE_CAMBIO));
}

export function useDatos<T>(ruta: string | null, { alCambiar = true } = {}) {
  const [datos, setDatos] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(ruta !== null);
  const [vuelta, setVuelta] = useState(0);
  const recargar = useCallback(() => setVuelta((anterior) => anterior + 1), []);

  useEffect(() => {
    if (!alCambiar) return;
    window.addEventListener(EVENTO_DE_CAMBIO, recargar);
    return () => window.removeEventListener(EVENTO_DE_CAMBIO, recargar);
  }, [alCambiar, recargar]);

  useEffect(() => {
    if (ruta === null) return;
    let vigente = true;
    setCargando(true);
    pedir<T>(ruta)
      .then((leidos) => {
        if (!vigente) return;
        setDatos(leidos);
        setError(null);
      })
      .catch((fallo: Error) => vigente && setError(fallo.message))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [ruta, vuelta]);

  return { datos, error, cargando, recargar };
}
