import { Firma } from "./AlmacenConocimiento";
import { Usuario } from "./Usuario";

export class DirectorioDeUsuarios {
  constructor(private readonly usuarios: Usuario[]) {}

  buscar(id: string): Usuario | null {
    return this.usuarios.find((usuario) => usuario.id === id) ?? null;
  }

  todos(): Usuario[] {
    return this.usuarios.map((usuario) => ({ ...usuario }));
  }

  ids(): Set<string> {
    return new Set(this.usuarios.map((usuario) => usuario.id));
  }

  firma(usuario: Usuario): Firma {
    return { nombre: usuario.id, email: `${usuario.id}@travis.local` };
  }
}
