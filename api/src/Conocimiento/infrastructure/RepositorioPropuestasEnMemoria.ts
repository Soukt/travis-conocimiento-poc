import { Propuesta } from "../domain/Propuesta";
import { RepositorioPropuestas } from "../domain/RepositorioPropuestas";

export class RepositorioPropuestasEnMemoria implements RepositorioPropuestas {
  private readonly propuestas = new Map<number, Propuesta>();

  async siguienteId(): Promise<number> {
    return Math.max(0, ...this.propuestas.keys()) + 1;
  }

  async guardar(propuesta: Propuesta): Promise<void> {
    this.propuestas.set(propuesta.id, Propuesta.desdeDatos(propuesta.datos()));
  }

  async buscar(id: number): Promise<Propuesta | null> {
    const propuesta = this.propuestas.get(id);
    return propuesta ? Propuesta.desdeDatos(propuesta.datos()) : null;
  }

  async listar(): Promise<Propuesta[]> {
    return [...this.propuestas.values()].map((propuesta) => Propuesta.desdeDatos(propuesta.datos()));
  }
}
