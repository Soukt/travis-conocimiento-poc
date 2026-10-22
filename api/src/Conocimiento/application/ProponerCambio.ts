import { AlmacenConocimiento, Cambio } from "../domain/AlmacenConocimiento";
import { DirectorioDeUsuarios } from "../domain/DirectorioDeUsuarios";
import { DatosPropuesta, OrigenPropuesta, Propuesta } from "../domain/Propuesta";
import { RepositorioPropuestas } from "../domain/RepositorioPropuestas";
import { tipoDePieza } from "../domain/Pieza";
import { Problema } from "../domain/ValidadorDeConocimiento";
import { problemasNuevos, Reloj, usuarioConocido } from "./Comun";
import { PeticionNoValida } from "./Errores";

export type PeticionDeCambio = {
  autor: string;
  titulo: string;
  descripcion?: string;
  cambios: Cambio[];
  origen: OrigenPropuesta;
};

const MAXIMO_DE_CAMBIOS = 50;
const MAXIMO_POR_FICHERO = 200_000;

export class ProponerCambio {
  private cola: Promise<unknown> = Promise.resolve();

  constructor(
    private readonly almacen: AlmacenConocimiento,
    private readonly propuestas: RepositorioPropuestas,
    private readonly usuarios: DirectorioDeUsuarios,
    private readonly reloj: Reloj,
  ) {}

  async ejecutar(peticion: PeticionDeCambio): Promise<{ propuesta: DatosPropuesta; problemas: Problema[] }> {
    const resultado = this.cola.then(
      () => this.proponer(peticion),
      () => this.proponer(peticion),
    );
    this.cola = resultado.catch(() => undefined);
    return resultado;
  }

  // En cola: el número de la propuesta sale de las que ya hay, y dos a la vez se llevarían el mismo.
  private async proponer(peticion: PeticionDeCambio): Promise<{ propuesta: DatosPropuesta; problemas: Problema[] }> {
    const autor = usuarioConocido(this.usuarios, peticion.autor);
    const titulo = (peticion.titulo ?? "").trim();
    if (titulo.length === 0) throw new PeticionNoValida("la propuesta necesita un título");
    this.comprobarCambios(peticion.cambios);

    const { commit: base } = await this.almacen.versionPublicada();
    const id = await this.propuestas.siguienteId();
    const rama = `propuesta/${id}`;
    const descripcion = (peticion.descripcion ?? "").trim();
    const mensaje = [titulo, descripcion, `Propuesta #${id} de ${autor.id} (${peticion.origen})`].filter(Boolean).join("\n\n");
    const { ficheros } = await this.almacen.crearRama(rama, base, peticion.cambios, this.usuarios.firma(autor), mensaje);

    const propuesta = Propuesta.nueva({ id, titulo, descripcion, autor, origen: peticion.origen, rama, base, ficheros, creadaEn: this.reloj() });
    await this.propuestas.guardar(propuesta);
    return { propuesta: propuesta.datos(), problemas: await problemasNuevos(this.almacen, propuesta, this.usuarios) };
  }

  private comprobarCambios(cambios: Cambio[]) {
    if (!Array.isArray(cambios) || cambios.length === 0) throw new PeticionNoValida("la propuesta no trae ningún cambio");
    if (cambios.length > MAXIMO_DE_CAMBIOS) throw new PeticionNoValida(`como mucho ${MAXIMO_DE_CAMBIOS} ficheros por propuesta`);
    const vistas = new Set<string>();
    for (const cambio of cambios) {
      if (typeof cambio?.ruta !== "string" || !tipoDePieza(cambio.ruta)) {
        throw new PeticionNoValida(`la ruta ${String(cambio?.ruta)} no encaja en la estructura (ver FORMATO.md)`);
      }
      if (vistas.has(cambio.ruta)) throw new PeticionNoValida(`la ruta ${cambio.ruta} viene repetida`);
      vistas.add(cambio.ruta);
      if (cambio.contenido !== null && typeof cambio.contenido !== "string") {
        throw new PeticionNoValida(`el contenido de ${cambio.ruta} tiene que ser texto, o null para borrarlo`);
      }
      if (typeof cambio.contenido === "string" && cambio.contenido.length > MAXIMO_POR_FICHERO) {
        throw new PeticionNoValida(`${cambio.ruta} es demasiado grande`);
      }
    }
  }
}
