import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { DatosPropuesta, Propuesta } from "../domain/Propuesta";
import { RepositorioPropuestas } from "../domain/RepositorioPropuestas";

export class RepositorioPropuestasJson implements RepositorioPropuestas {
  private cola: Promise<unknown> = Promise.resolve();

  constructor(private readonly fichero: string) {}

  async siguienteId(): Promise<number> {
    return Math.max(0, ...(await this.leer()).map((propuesta) => propuesta.id)) + 1;
  }

  async guardar(propuesta: Propuesta): Promise<void> {
    const escritura = this.cola.then(async () => {
      const todas = (await this.leer()).filter((guardada) => guardada.id !== propuesta.id);
      todas.push(propuesta.datos());
      todas.sort((a, b) => a.id - b.id);
      await mkdir(dirname(this.fichero), { recursive: true });
      const temporal = `${this.fichero}.${process.pid}.tmp`;
      await writeFile(temporal, `${JSON.stringify(todas, null, 2)}\n`);
      await rename(temporal, this.fichero);
    });
    this.cola = escritura.catch(() => undefined);
    return escritura;
  }

  async buscar(id: number): Promise<Propuesta | null> {
    const datos = (await this.leer()).find((propuesta) => propuesta.id === id);
    return datos ? Propuesta.desdeDatos(datos) : null;
  }

  async listar(): Promise<Propuesta[]> {
    return (await this.leer()).map((datos) => Propuesta.desdeDatos(datos));
  }

  private async leer(): Promise<DatosPropuesta[]> {
    try {
      return JSON.parse(await readFile(this.fichero, "utf8")) as DatosPropuesta[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }
}
