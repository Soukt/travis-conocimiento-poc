import { AlmacenConocimiento } from "../domain/AlmacenConocimiento";
import { RepositorioPropuestas } from "../domain/RepositorioPropuestas";

export type EntradaDeVersion = {
  version: number | null;
  commit: string;
  fecha: string;
  publicadaPor: string;
  mensaje: string;
  propuesta?: { id: number; titulo: string; autor: string; origen: string };
};

export class VerHistorial {
  constructor(
    private readonly almacen: AlmacenConocimiento,
    private readonly propuestas: RepositorioPropuestas,
  ) {}

  async historial(ruta?: string): Promise<EntradaDeVersion[]> {
    const [entradas, propuestas] = await Promise.all([this.almacen.historial(ruta), this.propuestas.listar()]);
    const porVersion = new Map(propuestas.filter((propuesta) => propuesta.version).map((propuesta) => [propuesta.version!, propuesta.datos()]));
    return entradas.map((entrada) => {
      const propuesta = entrada.version === null ? undefined : porVersion.get(entrada.version);
      return {
        version: entrada.version,
        commit: entrada.commit,
        fecha: entrada.fecha,
        publicadaPor: entrada.autor,
        mensaje: entrada.mensaje,
        ...(propuesta && { propuesta: { id: propuesta.id, titulo: propuesta.titulo, autor: propuesta.autor, origen: propuesta.origen } }),
      };
    });
  }

  async enVersion(ruta: string, version: number): Promise<string | null> {
    return this.almacen.leer(ruta, `v${version}`);
  }

  async diferencias(ruta: string, desde: number, hasta: number): Promise<string> {
    return this.almacen.diferencias(`v${desde}`, `v${hasta}`, ruta);
  }
}
