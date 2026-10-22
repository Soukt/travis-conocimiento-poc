import { AlmacenConocimiento, Cambio } from "../domain/AlmacenConocimiento";
import { DirectorioDeUsuarios } from "../domain/DirectorioDeUsuarios";
import { Problema } from "../domain/ValidadorDeConocimiento";
import { problemasQueAnade } from "./Comun";
import { PeticionNoValida } from "./Errores";

export class ValidarBorrador {
  constructor(
    private readonly almacen: AlmacenConocimiento,
    private readonly usuarios: DirectorioDeUsuarios,
  ) {}

  async ejecutar(cambios: Cambio[]): Promise<Problema[]> {
    if (!Array.isArray(cambios) || cambios.length === 0) throw new PeticionNoValida("no hay nada que validar");
    const publicado = await this.almacen.leerArbol("master");
    const borrador = new Map(publicado);
    for (const { ruta, contenido } of cambios) {
      if (contenido === null) borrador.delete(ruta);
      else borrador.set(ruta, contenido);
    }
    return problemasQueAnade(publicado, borrador, this.usuarios);
  }
}
