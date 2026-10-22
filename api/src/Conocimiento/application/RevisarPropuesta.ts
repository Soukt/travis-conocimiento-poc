import { AlmacenConocimiento } from "../domain/AlmacenConocimiento";
import { DirectorioDeUsuarios } from "../domain/DirectorioDeUsuarios";
import { leerCabecera, tipoDePieza } from "../domain/Pieza";
import { DatosPropuesta } from "../domain/Propuesta";
import { RepositorioPropuestas } from "../domain/RepositorioPropuestas";
import { Problema } from "../domain/ValidadorDeConocimiento";
import { problemasNuevos, propuestaExistente, Reloj, responsablesPublicados, usuarioConocido } from "./Comun";

export type FicheroDePropuesta = {
  ruta: string;
  cambio: "nuevo" | "cambiado" | "borrado";
  diferencias: string;
  responsables: string[];
};

export type DetallePropuesta = {
  propuesta: DatosPropuesta;
  ficheros: FicheroDePropuesta[];
  problemas: Problema[];
  pendientes: string[];
  pruebasAutomaticas: { disponible: false; motivo: string; casos: Array<{ caso: string; ruta: string; pruebas: number }> };
};

const SIN_BATERIA = "Necesita a Travis: cuando exista, se lanzan aquí las pruebas de los casos tocados y su resultado bloquea la publicación.";

export class RevisarPropuesta {
  private cola: Promise<unknown> = Promise.resolve();

  constructor(
    private readonly almacen: AlmacenConocimiento,
    private readonly propuestas: RepositorioPropuestas,
    private readonly usuarios: DirectorioDeUsuarios,
    private readonly reloj: Reloj,
  ) {}

  async listar(): Promise<DatosPropuesta[]> {
    return (await this.propuestas.listar()).map((propuesta) => propuesta.datos()).sort((a, b) => b.id - a.id);
  }

  async detalle(id: number): Promise<DetallePropuesta> {
    const propuesta = await propuestaExistente(this.propuestas, id);
    const [responsables, problemas] = await Promise.all([
      responsablesPublicados(this.almacen),
      problemasNuevos(this.almacen, propuesta, this.usuarios),
    ]);
    const ficheros = await Promise.all(
      propuesta.ficheros.map(async (ruta): Promise<FicheroDePropuesta> => {
        const [antes, despues, diferencias] = await Promise.all([
          this.almacen.leer(ruta, propuesta.base),
          this.almacen.leer(ruta, propuesta.rama),
          this.almacen.diferencias(propuesta.base, propuesta.rama, ruta),
        ]);
        const cambio = antes === null ? "nuevo" : despues === null ? "borrado" : "cambiado";
        return { ruta, cambio, diferencias, responsables: responsables.de(ruta) };
      }),
    );
    return {
      propuesta: propuesta.datos(),
      ficheros,
      problemas,
      pendientes: propuesta.pendientesParaPublicar(problemas, responsables),
      pruebasAutomaticas: { disponible: false, motivo: SIN_BATERIA, casos: await this.pruebasQueSeLanzarian(propuesta.rama, propuesta.ficheros) },
    };
  }

  async marcarProbada(id: number, usuarioId: string): Promise<DatosPropuesta> {
    return this.enCola(async () => {
      const propuesta = await propuestaExistente(this.propuestas, id);
      propuesta.marcarProbada(usuarioConocido(this.usuarios, usuarioId), this.reloj());
      await this.propuestas.guardar(propuesta);
      return propuesta.datos();
    });
  }

  async aprobar(id: number, usuarioId: string): Promise<DatosPropuesta> {
    return this.enCola(async () => {
      const propuesta = await propuestaExistente(this.propuestas, id);
      propuesta.aprobar(usuarioConocido(this.usuarios, usuarioId), await responsablesPublicados(this.almacen), this.reloj());
      await this.propuestas.guardar(propuesta);
      return propuesta.datos();
    });
  }

  async rechazar(id: number, usuarioId: string, motivo: string): Promise<DatosPropuesta> {
    return this.enCola(async () => {
      const propuesta = await propuestaExistente(this.propuestas, id);
      propuesta.rechazar(usuarioConocido(this.usuarios, usuarioId), motivo ?? "", await responsablesPublicados(this.almacen), this.reloj());
      await this.propuestas.guardar(propuesta);
      return propuesta.datos();
    });
  }

  async publicar(id: number, usuarioId: string): Promise<DatosPropuesta> {
    return this.enCola(async () => {
      const propuesta = await propuestaExistente(this.propuestas, id);
      const usuario = usuarioConocido(this.usuarios, usuarioId);
      const [responsables, problemas] = await Promise.all([
        responsablesPublicados(this.almacen),
        problemasNuevos(this.almacen, propuesta, this.usuarios),
      ]);
      propuesta.comprobarQueSePuedePublicar(usuario, problemas, responsables);

      const aprobadores = propuesta.aprobaciones.map((aprobacion) => aprobacion.usuario).join(", ");
      const mensaje = `Publica la propuesta #${propuesta.id}: ${propuesta.titulo}\n\nPropuesta de ${propuesta.autor}. Probada por ${propuesta.probadaPor}. Aprobada por ${aprobadores}.`;
      const { version } = await this.almacen.publicar(propuesta.rama, this.usuarios.firma(usuario), mensaje);

      propuesta.publicar(usuario, version, problemas, responsables, this.reloj());
      await this.propuestas.guardar(propuesta);
      return propuesta.datos();
    });
  }

  private async pruebasQueSeLanzarian(rama: string, ficheros: string[]) {
    const rutas = new Set<string>();
    for (const ruta of ficheros) {
      const pieza = tipoDePieza(ruta);
      if (pieza?.tipo === "caso" || pieza?.tipo === "pruebas") {
        rutas.add(`agentes/${pieza.agente}/casos/${pieza.area}/${pieza.caso}/pruebas.md`);
      }
    }
    const casos = [];
    for (const ruta of [...rutas].sort()) {
      const contenido = await this.almacen.leer(ruta, rama);
      if (contenido === null) continue;
      const pruebas = leerCabecera(contenido).cabecera?.pruebas;
      casos.push({ caso: ruta.split("/").at(-2)!, ruta, pruebas: Array.isArray(pruebas) ? pruebas.length : 0 });
    }
    return casos;
  }

  // Serializa las escrituras: dos publicaciones a la vez de la misma propuesta darían dos versiones.
  private enCola<T>(trabajo: () => Promise<T>): Promise<T> {
    const resultado = this.cola.then(trabajo, trabajo);
    this.cola = resultado.catch(() => undefined);
    return resultado;
  }
}
