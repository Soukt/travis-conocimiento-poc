import { parse } from "yaml";
import { Cabecera, leerCabecera, Pieza, tipoDePieza } from "./Pieza";

export type Problema = { ruta: string; mensaje: string };

export type Arbol = ReadonlyMap<string, string>;

export const MODOS = ["autonomo", "copiloto", "persona"] as const;
export const MERCADOS = ["es", "pt", "it", "fr"] as const;
export const SECCIONES_CASO = [
  "Cuándo aplica",
  "Qué hace el agente",
  "Qué no hace",
  "Cuándo pasa a una persona",
  "Cómo lo puede pedir el cliente",
] as const;

const NOMBRE_VALIDO = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FECHA_VALIDA = /^\d{4}-\d{2}-\d{2}$/;
const CAMPOS_CASO = new Set(["name", "description", "license", "compatibility", "metadata", "allowed-tools"]);
const CITA = /`([a-z0-9][a-z0-9/-]*)`/g;

type Contexto = {
  arbol: Arbol;
  acciones: Set<string>;
  informacion: Set<string>;
  plantillas: Set<string>;
  areas: Set<string>;
  usuarios?: ReadonlySet<string>;
  problemas: Problema[];
};

export function validarConocimiento(arbol: Arbol, opciones: { usuarios?: ReadonlySet<string> } = {}): Problema[] {
  const contexto: Contexto = { arbol, ...catalogos(arbol), usuarios: opciones.usuarios, problemas: [] };
  const casosVistos = new Map<string, string>();

  for (const [ruta, contenido] of [...arbol.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const pieza = tipoDePieza(ruta);
    const fallo = (mensaje: string) => contexto.problemas.push({ ruta, mensaje });
    if (!pieza) {
      fallo("esta ruta no encaja en la estructura (ver FORMATO.md)");
      continue;
    }
    if (pieza.tipo === "formato") continue;
    if (pieza.tipo === "responsables") {
      validarResponsables(contenido, contexto, fallo);
      continue;
    }

    const { cabecera, cuerpo, error } = leerCabecera(contenido);
    if (error) {
      fallo(error);
      continue;
    }
    if (!cabecera) {
      fallo("falta la cabecera (el bloque entre líneas ---)");
      continue;
    }
    validarPieza(pieza, ruta, cabecera, cuerpo, contexto, fallo);
    if (pieza.tipo === "caso" && typeof cabecera.name === "string") {
      const carpeta = `${pieza.area}/${pieza.caso}`;
      const anterior = casosVistos.get(cabecera.name);
      if (anterior) fallo(`name «${cabecera.name}» repetido: ya lo usa ${anterior}`);
      else casosVistos.set(cabecera.name, carpeta);
    }
  }
  return contexto.problemas;
}

function catalogos(arbol: Arbol) {
  const acciones = new Set<string>();
  const informacion = new Set<string>();
  const plantillas = new Set<string>();
  const areas = new Set<string>();
  for (const ruta of arbol.keys()) {
    const pieza = tipoDePieza(ruta);
    if (pieza?.tipo === "accion") acciones.add(pieza.nombre);
    if (pieza?.tipo === "informacion") informacion.add(pieza.id);
    if (pieza?.tipo === "plantilla") plantillas.add(pieza.nombre);
    if (pieza?.tipo === "area") areas.add(pieza.area);
  }
  return { acciones, informacion, plantillas, areas };
}

function validarPieza(pieza: Pieza, ruta: string, cabecera: Cabecera, cuerpo: string, contexto: Contexto, fallo: (m: string) => void) {
  switch (pieza.tipo) {
    case "agente":
      validarNombre(cabecera, pieza.agente, fallo);
      exigirTexto(cabecera, "description", fallo);
      return;
    case "area":
      validarNombre(cabecera, pieza.area, fallo);
      exigirTexto(cabecera, "titulo", fallo);
      exigirTexto(cabecera, "description", fallo);
      return;
    case "caso":
      validarCaso(pieza, ruta, cabecera, cuerpo, contexto, fallo);
      return;
    case "pruebas":
      validarPruebas(pieza, ruta, cabecera, contexto, fallo);
      return;
    case "informacion":
      validarNombre(cabecera, pieza.nombre, fallo);
      exigirTexto(cabecera, "titulo", fallo);
      exigirTexto(cabecera, "description", fallo);
      if (!/^## /m.test(cuerpo)) fallo("tiene que tener al menos una pregunta (un apartado ## ¿…?)");
      return;
    case "aviso":
      validarAviso(pieza.nombre, cabecera, contexto, fallo);
      return;
    case "plantilla":
      validarNombre(cabecera, pieza.nombre, fallo);
      exigirTexto(cabecera, "titulo", fallo);
      exigirTexto(cabecera, "description", fallo);
      validarMercados(cabecera.mercados, fallo);
      return;
    case "accion":
      validarNombre(cabecera, pieza.nombre, fallo);
      exigirTexto(cabecera, "description", fallo);
      return;
  }
}

function validarNombre(cabecera: Cabecera, esperado: string, fallo: (m: string) => void) {
  const nombre = cabecera.name;
  if (typeof nombre !== "string" || nombre.length === 0 || nombre.length > 64 || !NOMBRE_VALIDO.test(nombre)) {
    fallo("name: de 1 a 64 caracteres, en minúsculas, con números y guiones sueltos");
    return;
  }
  if (nombre !== esperado) fallo(`name «${nombre}» no coincide con «${esperado}»`);
}

function exigirTexto(cabecera: Cabecera, campo: string, fallo: (m: string) => void) {
  const valor = cabecera[campo];
  if (typeof valor !== "string" || valor.trim().length === 0) fallo(`falta ${campo}`);
}

function listaDeTextos(valor: unknown): string[] | null {
  if (valor === undefined) return [];
  if (!Array.isArray(valor) || valor.some((elemento) => typeof elemento !== "string")) return null;
  return valor as string[];
}

function validarCaso(
  pieza: Extract<Pieza, { tipo: "caso" }>,
  ruta: string,
  cabecera: Cabecera,
  cuerpo: string,
  contexto: Contexto,
  fallo: (m: string) => void,
) {
  validarNombre(cabecera, pieza.caso, fallo);
  for (const campo of Object.keys(cabecera)) {
    if (!CAMPOS_CASO.has(campo)) fallo(`campo de cabecera no permitido: ${campo} (los datos propios van en metadata)`);
  }
  const descripcion = cabecera.description;
  if (typeof descripcion !== "string" || descripcion.trim().length === 0) fallo("falta description");
  else if (descripcion.length > 1024) fallo("description: como mucho 1024 caracteres");

  const carpetaArea = `agentes/${pieza.agente}/casos/${pieza.area}`;
  if (!contexto.arbol.has(`${carpetaArea}/AREA.md`)) fallo(`el área «${pieza.area}» no tiene AREA.md`);
  if (!contexto.arbol.has(ruta.replace(/SKILL\.md$/, "pruebas.md"))) fallo("falta pruebas.md al lado del caso");
  for (const seccion of SECCIONES_CASO) {
    if (!new RegExp(`^## ${seccion}\\s*$`, "m").test(cuerpo)) fallo(`falta la sección «${seccion}»`);
  }

  const metadata = cabecera.metadata;
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    fallo("falta metadata");
    return;
  }
  const datos = metadata as Record<string, unknown>;
  if (datos.area !== pieza.area) fallo(`metadata.area tiene que ser «${pieza.area}»`);
  if (!MODOS.includes(datos.modo as (typeof MODOS)[number])) fallo(`metadata.modo tiene que ser ${MODOS.join(", ")}`);
  if (datos.titulo !== undefined && typeof datos.titulo !== "string") fallo("metadata.titulo tiene que ser texto");

  const declaradas: Set<string> = new Set();
  const comprobar = (campo: string, catalogo: Set<string>, nombre: string) => {
    const lista = listaDeTextos(datos[campo]);
    if (lista === null) {
      fallo(`metadata.${campo} tiene que ser una lista`);
      return [];
    }
    for (const elemento of lista) {
      declaradas.add(elemento);
      if (!catalogo.has(elemento)) fallo(`${nombre} «${elemento}» no existe`);
    }
    return lista;
  };
  const acciones = comprobar("acciones", contexto.acciones, "la acción");
  comprobar("informacion", contexto.informacion, "la información");
  comprobar("plantillas", contexto.plantillas, "la plantilla");

  if (datos.modo === "persona" && !acciones.includes("crear-ticket-booking")) {
    fallo("un caso en modo persona tiene que usar crear-ticket-booking");
  }
  for (const [, citado] of cuerpo.matchAll(CITA)) {
    if (!declaradas.has(citado)) fallo(`el texto cita \`${citado}\` pero la cabecera no lo declara`);
  }
}

function validarPruebas(
  pieza: Extract<Pieza, { tipo: "pruebas" }>,
  ruta: string,
  cabecera: Cabecera,
  contexto: Contexto,
  fallo: (m: string) => void,
) {
  if (cabecera.caso !== pieza.caso) fallo(`caso tiene que ser «${pieza.caso}»`);
  if (!contexto.arbol.has(ruta.replace(/pruebas\.md$/, "SKILL.md"))) fallo("no hay SKILL.md al lado de estas pruebas");

  const pruebas = cabecera.pruebas;
  if (!Array.isArray(pruebas) || pruebas.length === 0) {
    fallo("tiene que haber al menos una prueba en «pruebas»");
    return;
  }
  pruebas.forEach((prueba, indice) => {
    const numero = indice + 1;
    if (!prueba || typeof prueba !== "object") {
      fallo(`la prueba ${numero} tiene que tener pregunta y esperado`);
      return;
    }
    const datos = prueba as Record<string, unknown>;
    for (const campo of ["pregunta", "esperado"]) {
      if (typeof datos[campo] !== "string" || (datos[campo] as string).trim().length === 0) fallo(`la prueba ${numero} no tiene ${campo}`);
    }
    if (datos.mercado !== undefined && !MERCADOS.includes(datos.mercado as (typeof MERCADOS)[number])) {
      fallo(`la prueba ${numero} tiene un mercado que no existe: ${String(datos.mercado)}`);
    }
  });
}

function validarAviso(nombre: string, cabecera: Cabecera, contexto: Contexto, fallo: (m: string) => void) {
  validarNombre(cabecera, nombre, fallo);
  exigirTexto(cabecera, "titulo", fallo);
  const { desde, hasta } = cabecera;
  const desdeValida = typeof desde === "string" && FECHA_VALIDA.test(desde);
  const hastaValida = typeof hasta === "string" && FECHA_VALIDA.test(hasta);
  if (!desdeValida) fallo("desde tiene que ser una fecha AAAA-MM-DD");
  if (!hastaValida) fallo("hasta tiene que ser una fecha AAAA-MM-DD");
  if (desdeValida && hastaValida && (hasta as string) < (desde as string)) fallo("hasta no puede ser anterior a desde");

  const areas = listaDeTextos(cabecera.areas);
  if (areas === null) fallo("areas tiene que ser una lista");
  for (const area of areas ?? []) {
    if (!contexto.areas.has(area)) fallo(`el área «${area}» no existe`);
  }
  validarMercados(cabecera.mercados, fallo);
}

function validarMercados(valor: unknown, fallo: (m: string) => void) {
  const mercados = listaDeTextos(valor);
  if (mercados === null) {
    fallo("mercados tiene que ser una lista");
    return;
  }
  for (const mercado of mercados) {
    if (!MERCADOS.includes(mercado as (typeof MERCADOS)[number])) fallo(`mercado que no existe: ${mercado}`);
  }
}

function validarResponsables(contenido: string, contexto: Contexto, fallo: (m: string) => void) {
  let reglas: unknown;
  try {
    reglas = parse(contenido);
  } catch (error) {
    fallo(`no es YAML válido: ${error instanceof Error ? error.message.split("\n")[0] : String(error)}`);
    return;
  }
  if (!Array.isArray(reglas)) {
    fallo("tiene que ser una lista de reglas (- ruta: … responsables: […])");
    return;
  }
  let hayGeneral = false;
  reglas.forEach((regla, indice) => {
    const numero = indice + 1;
    const datos = (regla ?? {}) as Record<string, unknown>;
    if (typeof datos.ruta !== "string" || datos.ruta.length === 0) fallo(`la regla ${numero} no tiene ruta`);
    if (datos.ruta === "*") hayGeneral = true;
    const responsables = listaDeTextos(datos.responsables);
    if (!responsables || responsables.length === 0) {
      fallo(`la regla ${numero} (${String(datos.ruta)}) está sin responsables`);
      return;
    }
    for (const responsable of responsables) {
      if (contexto.usuarios && !contexto.usuarios.has(responsable)) fallo(`«${responsable}» no es un usuario conocido`);
    }
  });
  if (!hayGeneral) fallo("falta una regla para «*», que cubre lo que no cubran las demás");
}
