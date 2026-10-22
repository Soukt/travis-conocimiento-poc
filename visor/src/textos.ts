import { TipoPieza } from "./api";

export const TIPOS: Record<TipoPieza, string> = {
  formato: "Formato",
  responsables: "Responsables",
  agente: "Reglas del agente",
  area: "Área",
  caso: "Caso",
  pruebas: "Pruebas",
  informacion: "Información",
  aviso: "Aviso",
  plantilla: "Plantilla",
  accion: "Acción",
};

export const MODOS: Record<string, { texto: string; color: "success" | "warning" | "default" }> = {
  autonomo: { texto: "Responde solo", color: "success" },
  copiloto: { texto: "Copiloto", color: "warning" },
  persona: { texto: "Pasa a booking", color: "default" },
};

export const ESTADOS = {
  abierta: { texto: "Abierta", color: "warning" },
  publicada: { texto: "Publicada", color: "success" },
  rechazada: { texto: "Rechazada", color: "default" },
} as const;

export const MERCADOS = ["es", "pt", "it", "fr"];

// Solo toca los nombres técnicos (cambiar-fechas); un título escrito por una persona se deja como está.
export const humanizar = (nombre: string) => {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(nombre)) return nombre;
  const conEspacios = nombre.replace(/-/g, " ");
  return conEspacios.charAt(0).toUpperCase() + conEspacios.slice(1);
};

const FORMATO_DE_FECHA = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Madrid" });

export const fecha = (iso?: string) => (iso ? FORMATO_DE_FECHA.format(new Date(iso)) : "");

export const enlaceAPieza = (ruta: string, ref?: string) => `/pieza?ruta=${encodeURIComponent(ruta)}${ref ? `&ref=${encodeURIComponent(ref)}` : ""}`;
