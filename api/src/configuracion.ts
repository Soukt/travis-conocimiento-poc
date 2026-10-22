import { resolve } from "node:path";

const RAIZ = resolve(__dirname, "../..");

export const CONFIGURACION = {
  puerto: Number(process.env.PUERTO_API ?? 3101),
  carpetaDatos: resolve(process.env.CARPETA_DATOS ?? `${RAIZ}/data`),
  carpetaContenido: resolve(process.env.CARPETA_CONTENIDO ?? `${RAIZ}/contenido`),
  urlVisor: process.env.URL_VISOR ?? "http://localhost:3100",
  zonaHoraria: "Europe/Madrid",
};

export function hoy(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: CONFIGURACION.zonaHoraria }).format(new Date());
}
