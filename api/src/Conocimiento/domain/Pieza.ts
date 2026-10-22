import { parse } from "yaml";

export type Pieza =
  | { tipo: "formato" }
  | { tipo: "responsables" }
  | { tipo: "agente"; agente: string }
  | { tipo: "area"; agente: string; area: string }
  | { tipo: "caso"; agente: string; area: string; caso: string }
  | { tipo: "pruebas"; agente: string; area: string; caso: string }
  | { tipo: "informacion"; id: string; nombre: string }
  | { tipo: "aviso"; nombre: string }
  | { tipo: "plantilla"; nombre: string }
  | { tipo: "accion"; nombre: string };

export type TipoPieza = Pieza["tipo"];

// Solo letras, números, punto, guion y guion bajo: una ruta con espacios o saltos de línea rompería el índice de git.
const S = "([A-Za-z0-9._-]+)";

const PATRONES: Array<[RegExp, (m: RegExpMatchArray) => Pieza]> = [
  [/^FORMATO\.md$/, () => ({ tipo: "formato" })],
  [/^responsables\.yml$/, () => ({ tipo: "responsables" })],
  [new RegExp(`^agentes/${S}/AGENTE\\.md$`), (m) => ({ tipo: "agente", agente: m[1] })],
  [new RegExp(`^agentes/${S}/casos/${S}/AREA\\.md$`), (m) => ({ tipo: "area", agente: m[1], area: m[2] })],
  [new RegExp(`^agentes/${S}/casos/${S}/${S}/SKILL\\.md$`), (m) => ({ tipo: "caso", agente: m[1], area: m[2], caso: m[3] })],
  [new RegExp(`^agentes/${S}/casos/${S}/${S}/pruebas\\.md$`), (m) => ({ tipo: "pruebas", agente: m[1], area: m[2], caso: m[3] })],
  [new RegExp(`^informacion/${S}/${S}\\.md$`), (m) => ({ tipo: "informacion", id: `${m[1]}/${m[2]}`, nombre: m[2] })],
  [new RegExp(`^avisos/${S}\\.md$`), (m) => ({ tipo: "aviso", nombre: m[1] })],
  [new RegExp(`^plantillas/${S}\\.md$`), (m) => ({ tipo: "plantilla", nombre: m[1] })],
  [new RegExp(`^acciones/${S}\\.md$`), (m) => ({ tipo: "accion", nombre: m[1] })],
];

export function tipoDePieza(ruta: string): Pieza | null {
  if (ruta.split("/").some((parte) => parte === ".." || parte === ".")) return null;
  for (const [patron, construir] of PATRONES) {
    const encontrado = ruta.match(patron);
    if (encontrado) return construir(encontrado);
  }
  return null;
}

export type Cabecera = Record<string, unknown>;

export type PiezaLeida = { cabecera: Cabecera | null; cuerpo: string; error?: string };

export function leerCabecera(texto: string): PiezaLeida {
  if (!texto.startsWith("---\n")) return { cabecera: null, cuerpo: texto };

  const cierre = texto.indexOf("\n---", 3);
  if (cierre === -1) return { cabecera: null, cuerpo: texto, error: "la cabecera sin cerrar: falta la línea ---" };

  const yaml = texto.slice(4, cierre + 1);
  const finDeLinea = texto.indexOf("\n", cierre + 4);
  const cuerpo = finDeLinea === -1 ? "" : texto.slice(finDeLinea + 1);

  let cabecera: unknown;
  try {
    cabecera = parse(yaml);
  } catch (error) {
    const motivo = error instanceof Error ? error.message.split("\n")[0] : String(error);
    return { cabecera: null, cuerpo, error: `la cabecera no es YAML válido: ${motivo}` };
  }
  if (cabecera === null || cabecera === undefined) return { cabecera: {}, cuerpo };
  if (typeof cabecera !== "object" || Array.isArray(cabecera)) {
    return { cabecera: null, cuerpo, error: "la cabecera tiene que ser una lista de campos (clave: valor)" };
  }
  return { cabecera: cabecera as Cabecera, cuerpo };
}
