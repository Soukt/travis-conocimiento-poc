import { AlmacenConocimiento } from "../domain/AlmacenConocimiento";
import { Cabecera, leerCabecera, TipoPieza, tipoDePieza } from "../domain/Pieza";
import { responsablesPublicados } from "./Comun";
import { NoEncontrado } from "./Errores";

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

export type Cita = { tipo: "accion" | "informacion" | "plantilla"; nombre: string; ruta: string; titulo: string; existe: boolean };

export type DetallePieza = ResumenPieza & {
  contenido: string;
  cabecera: Cabecera | null;
  cuerpo: string;
  responsables: string[];
  pruebas?: unknown[];
  rutaPruebas?: string;
  rutaCaso?: string;
  citas: Cita[];
  citadaPor: ResumenPieza[];
};

export type EntradaDelIndice = { agente: string; area: string; titulo: string; descripcion: string; casos: number };
export type ResultadoDeBusqueda = ResumenPieza & { fragmento: string };

const CITABLES = [
  { campo: "acciones", tipo: "accion", ruta: (nombre: string) => `acciones/${nombre}.md` },
  { campo: "informacion", tipo: "informacion", ruta: (nombre: string) => `informacion/${nombre}.md` },
  { campo: "plantillas", tipo: "plantilla", ruta: (nombre: string) => `plantillas/${nombre}.md` },
] as const;

const texto = (valor: unknown) => (typeof valor === "string" && valor.trim().length > 0 ? valor.trim() : undefined);
const lista = (valor: unknown) => (Array.isArray(valor) ? valor.filter((elemento): elemento is string => typeof elemento === "string") : []);

export class ExplorarConocimiento {
  constructor(private readonly almacen: AlmacenConocimiento) {}

  version() {
    return this.almacen.versionPublicada();
  }

  async listado(ref = "master"): Promise<ResumenPieza[]> {
    const arbol = await this.almacen.leerArbol(ref);
    return [...arbol]
      .map(([ruta, contenido]) => resumir(ruta, contenido))
      .filter((resumen): resumen is ResumenPieza => resumen !== null)
      .sort((a, b) => a.ruta.localeCompare(b.ruta));
  }

  async indiceDeAreas(ref = "master"): Promise<EntradaDelIndice[]> {
    const listado = await this.listado(ref);
    return listado
      .filter((pieza) => pieza.tipo === "area")
      .map((area) => ({
        agente: area.agente!,
        area: area.area!,
        titulo: area.titulo,
        descripcion: area.descripcion ?? "",
        casos: listado.filter((pieza) => pieza.tipo === "caso" && pieza.agente === area.agente && pieza.area === area.area).length,
      }));
  }

  async pieza(ruta: string, ref = "master"): Promise<DetallePieza> {
    const arbol = await this.almacen.leerArbol(ref);
    const contenido = arbol.get(ruta);
    const resumen = contenido === undefined ? null : resumir(ruta, contenido);
    if (contenido === undefined || !resumen) throw new NoEncontrado(`no existe ${ruta} en ${ref}`);

    const { cabecera, cuerpo } = leerCabecera(contenido);
    const responsables = (await responsablesPublicados(this.almacen)).de(ruta);
    const detalle: DetallePieza = { ...resumen, contenido, cabecera, cuerpo, responsables, citas: [], citadaPor: [] };
    const pieza = tipoDePieza(ruta)!;

    if (pieza.tipo === "caso") {
      detalle.rutaPruebas = ruta.replace(/SKILL\.md$/, "pruebas.md");
      const pruebas = arbol.get(detalle.rutaPruebas);
      const leidas = pruebas === undefined ? undefined : leerCabecera(pruebas).cabecera?.pruebas;
      detalle.pruebas = Array.isArray(leidas) ? leidas : [];
      detalle.citas = this.citasDe(cabecera, arbol);
    }
    if (pieza.tipo === "pruebas") detalle.rutaCaso = ruta.replace(/pruebas\.md$/, "SKILL.md");
    if (pieza.tipo === "accion" || pieza.tipo === "informacion" || pieza.tipo === "plantilla") {
      const nombre = pieza.tipo === "informacion" ? pieza.id : pieza.nombre;
      detalle.citadaPor = this.casosQueCitan(pieza.tipo, nombre, arbol);
    }
    return detalle;
  }

  async buscar(consulta: string, ref = "master"): Promise<ResultadoDeBusqueda[]> {
    const buscado = normalizar(consulta.trim());
    if (buscado.length === 0) return [];
    const arbol = await this.almacen.leerArbol(ref);
    const resultados: Array<ResultadoDeBusqueda & { enTitulo: boolean }> = [];
    for (const [ruta, contenido] of arbol) {
      const resumen = resumir(ruta, contenido);
      if (!resumen) continue;
      const posicion = buscarSinTildes(contenido, buscado);
      if (posicion === null) continue;
      resultados.push({ ...resumen, fragmento: fragmento(contenido, posicion), enTitulo: normalizar(resumen.titulo).includes(buscado) });
    }
    return resultados
      .sort((a, b) => Number(b.enTitulo) - Number(a.enTitulo) || a.ruta.localeCompare(b.ruta))
      .slice(0, 50)
      .map(({ enTitulo: _enTitulo, ...resultado }) => resultado);
  }

  async avisosVigentes(hoy: string, ref = "master"): Promise<ResumenPieza[]> {
    return (await this.listado(ref)).filter((pieza) => pieza.tipo === "aviso" && pieza.desde! <= hoy && hoy <= pieza.hasta!);
  }

  private citasDe(cabecera: Cabecera | null, arbol: Map<string, string>): Cita[] {
    const metadata = (cabecera?.metadata ?? {}) as Record<string, unknown>;
    return CITABLES.flatMap(({ campo, tipo, ruta }) =>
      lista(metadata[campo]).map((nombre) => {
        const contenido = arbol.get(ruta(nombre));
        const citada = contenido === undefined ? null : leerCabecera(contenido).cabecera;
        return { tipo, nombre, ruta: ruta(nombre), titulo: texto(citada?.titulo) ?? texto(citada?.description) ?? nombre, existe: contenido !== undefined };
      }),
    );
  }

  private casosQueCitan(tipo: string, nombre: string, arbol: Map<string, string>): ResumenPieza[] {
    const campo = CITABLES.find((citable) => citable.tipo === tipo)!.campo;
    const casos: ResumenPieza[] = [];
    for (const [ruta, contenido] of arbol) {
      if (tipoDePieza(ruta)?.tipo !== "caso") continue;
      const metadata = (leerCabecera(contenido).cabecera?.metadata ?? {}) as Record<string, unknown>;
      if (lista(metadata[campo]).includes(nombre)) casos.push(resumir(ruta, contenido)!);
    }
    return casos.sort((a, b) => a.ruta.localeCompare(b.ruta));
  }
}

function resumir(ruta: string, contenido: string): ResumenPieza | null {
  const pieza = tipoDePieza(ruta);
  if (!pieza) return null;
  if (pieza.tipo === "formato") return { ruta, tipo: pieza.tipo, titulo: "Formato del conocimiento" };
  if (pieza.tipo === "responsables") return { ruta, tipo: pieza.tipo, titulo: "Responsables por carpeta" };

  const cabecera = leerCabecera(contenido).cabecera ?? {};
  const metadata = (cabecera.metadata ?? {}) as Record<string, unknown>;
  const nombreDeFichero = ruta.split("/").at(-1)!.replace(/\.md$/, "");
  const resumen: ResumenPieza = {
    ruta,
    tipo: pieza.tipo,
    titulo: texto(cabecera.titulo) ?? texto(cabecera.name) ?? nombreDeFichero,
    descripcion: texto(cabecera.description),
  };
  if ("agente" in pieza) resumen.agente = pieza.agente;
  if ("area" in pieza) resumen.area = pieza.area;
  if ("caso" in pieza) resumen.caso = pieza.caso;
  if (pieza.tipo === "pruebas") resumen.titulo = `Pruebas de ${pieza.caso}`;
  if (pieza.tipo === "caso") {
    resumen.modo = texto(metadata.modo);
    resumen.titulo = texto(metadata.titulo) ?? resumen.titulo;
  }
  if (pieza.tipo === "aviso") {
    resumen.desde = texto(cabecera.desde);
    resumen.hasta = texto(cabecera.hasta);
  }
  return resumen;
}

function normalizar(valor: string): string {
  return valor.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

// Busca en el texto normalizado y devuelve la posición en el original, que tiene otra longitud por las tildes.
function buscarSinTildes(original: string, buscado: string): number | null {
  let normalizado = "";
  const origen: number[] = [];
  for (let indice = 0; indice < original.length; indice++) {
    const trozo = normalizar(original[indice]);
    normalizado += trozo;
    for (let repeticion = 0; repeticion < trozo.length; repeticion++) origen.push(indice);
  }
  const posicion = normalizado.indexOf(buscado);
  return posicion === -1 ? null : origen[posicion];
}

function fragmento(contenido: string, posicion: number): string {
  const inicio = Math.max(0, posicion - 60);
  const fin = Math.min(contenido.length, posicion + 100);
  const trozo = contenido.slice(inicio, fin).replace(/\s+/g, " ").trim();
  return `${inicio > 0 ? "…" : ""}${trozo}${fin < contenido.length ? "…" : ""}`;
}
