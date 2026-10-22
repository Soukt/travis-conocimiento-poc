import { Propuesta } from "./Propuesta";

export interface RepositorioPropuestas {
  siguienteId(): Promise<number>;
  guardar(propuesta: Propuesta): Promise<void>;
  buscar(id: number): Promise<Propuesta | null>;
  listar(): Promise<Propuesta[]>;
}
