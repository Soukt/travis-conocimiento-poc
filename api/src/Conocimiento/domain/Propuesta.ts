import { Responsables } from "./Responsables";
import { Usuario } from "./Usuario";
import { Problema } from "./ValidadorDeConocimiento";

export class ErrorDeCircuito extends Error {}

export type EstadoPropuesta = "abierta" | "publicada" | "rechazada";
export type OrigenPropuesta = "visor" | "mcp";

export type DatosPropuesta = {
  id: number;
  titulo: string;
  descripcion: string;
  autor: string;
  autorEsIA: boolean;
  origen: OrigenPropuesta;
  rama: string;
  base: string;
  ficheros: string[];
  creadaEn: string;
  estado: EstadoPropuesta;
  probadaPor?: string;
  probadaEn?: string;
  aprobaciones: Array<{ usuario: string; en: string }>;
  rechazo?: { usuario: string; motivo: string; en: string };
  version?: number;
  publicadaPor?: string;
  publicadaEn?: string;
};

type NuevaPropuesta = {
  id: number;
  titulo: string;
  descripcion: string;
  autor: Usuario;
  origen: OrigenPropuesta;
  rama: string;
  base: string;
  ficheros: string[];
  creadaEn: Date;
};

export class Propuesta {
  private constructor(private readonly d: DatosPropuesta) {}

  static nueva(datos: NuevaPropuesta): Propuesta {
    return new Propuesta({
      id: datos.id,
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      autor: datos.autor.id,
      autorEsIA: Boolean(datos.autor.esIA),
      origen: datos.origen,
      rama: datos.rama,
      base: datos.base,
      ficheros: [...datos.ficheros].sort(),
      creadaEn: datos.creadaEn.toISOString(),
      estado: "abierta",
      aprobaciones: [],
    });
  }

  static desdeDatos(datos: DatosPropuesta): Propuesta {
    return new Propuesta(structuredClone(datos));
  }

  datos(): DatosPropuesta {
    return structuredClone(this.d);
  }

  get id() {
    return this.d.id;
  }
  get estado() {
    return this.d.estado;
  }
  get rama() {
    return this.d.rama;
  }
  get base() {
    return this.d.base;
  }
  get ficheros() {
    return [...this.d.ficheros];
  }
  get autor() {
    return this.d.autor;
  }
  get titulo() {
    return this.d.titulo;
  }
  get probadaPor() {
    return this.d.probadaPor;
  }
  get aprobaciones() {
    return this.d.aprobaciones.map((aprobacion) => ({ ...aprobacion }));
  }
  get rechazo() {
    return this.d.rechazo ? { ...this.d.rechazo } : undefined;
  }
  get version() {
    return this.d.version;
  }
  get publicadaPor() {
    return this.d.publicadaPor;
  }

  marcarProbada(usuario: Usuario, cuando: Date): void {
    this.exigirAbierta();
    this.exigirPersona(usuario, "marcarla como probada");
    if (!this.d.autorEsIA && usuario.id !== this.d.autor) {
      throw new ErrorDeCircuito("solo quien hizo el cambio puede marcarlo como probado");
    }
    this.d.probadaPor = usuario.id;
    this.d.probadaEn = cuando.toISOString();
  }

  aprobar(usuario: Usuario, responsables: Responsables, cuando: Date): void {
    this.exigirAbierta();
    this.exigirPersona(usuario, "aprobarla");
    if (usuario.id === this.d.autor) throw new ErrorDeCircuito("nadie aprueba su propia propuesta");
    if (!responsables.esResponsableDeAlguno(usuario.id, this.d.ficheros)) {
      throw new ErrorDeCircuito(`${usuario.id} no es responsable de ninguno de los ficheros que toca`);
    }
    if (this.d.aprobaciones.some((aprobacion) => aprobacion.usuario === usuario.id)) {
      throw new ErrorDeCircuito(`${usuario.id} ya la aprobó`);
    }
    this.d.aprobaciones.push({ usuario: usuario.id, en: cuando.toISOString() });
  }

  rechazar(usuario: Usuario, motivo: string, responsables: Responsables, cuando: Date): void {
    this.exigirAbierta();
    this.exigirPersona(usuario, "rechazarla");
    if (motivo.trim().length === 0) throw new ErrorDeCircuito("hace falta un motivo para rechazarla");
    const esAutor = usuario.id === this.d.autor;
    if (!esAutor && !responsables.esResponsableDeAlguno(usuario.id, this.d.ficheros)) {
      throw new ErrorDeCircuito(`${usuario.id} no es responsable de ninguno de los ficheros que toca`);
    }
    this.d.estado = "rechazada";
    this.d.rechazo = { usuario: usuario.id, motivo: motivo.trim(), en: cuando.toISOString() };
  }

  pendientesParaPublicar(validacion: Problema[], responsables: Responsables): string[] {
    if (this.d.estado !== "abierta") return [`ya está ${this.d.estado}`];
    const pendientes: string[] = [];
    if (validacion.length > 0) {
      pendientes.push(`la validación de formato tiene ${validacion.length} ${validacion.length === 1 ? "problema" : "problemas"}`);
    }
    if (!this.d.probadaPor) pendientes.push("falta que quien hizo el cambio lo pruebe en Travis");
    const aprobadores = new Set(this.d.aprobaciones.map((aprobacion) => aprobacion.usuario));
    for (const fichero of this.d.ficheros) {
      const suyos = responsables.de(fichero);
      if (!suyos.some((responsable) => aprobadores.has(responsable))) {
        pendientes.push(`falta la aprobación de un responsable de ${fichero} (${suyos.join(", ") || "nadie: revisa responsables.yml"})`);
      }
    }
    return pendientes;
  }

  comprobarQueSePuedePublicar(usuario: Usuario, validacion: Problema[], responsables: Responsables): void {
    this.exigirAbierta();
    this.exigirPersona(usuario, "publicarla");
    const pendientes = this.pendientesParaPublicar(validacion, responsables);
    if (pendientes.length > 0) throw new ErrorDeCircuito(`todavía no se puede publicar: ${pendientes.join("; ")}`);
  }

  publicar(usuario: Usuario, version: number, validacion: Problema[], responsables: Responsables, cuando: Date): void {
    this.comprobarQueSePuedePublicar(usuario, validacion, responsables);
    this.d.estado = "publicada";
    this.d.version = version;
    this.d.publicadaPor = usuario.id;
    this.d.publicadaEn = cuando.toISOString();
  }

  private exigirAbierta() {
    if (this.d.estado !== "abierta") throw new ErrorDeCircuito(`la propuesta ya está ${this.d.estado}`);
  }

  private exigirPersona(usuario: Usuario, accion: string) {
    if (usuario.esIA) throw new ErrorDeCircuito(`${accion} lo tiene que hacer una persona`);
  }
}
