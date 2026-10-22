import { parse } from "yaml";

type Regla = { ruta: string; responsables: string[] };

export class Responsables {
  private constructor(private readonly reglas: Regla[]) {}

  static desdeYaml(texto: string): Responsables {
    let leidas: unknown;
    try {
      leidas = parse(texto);
    } catch {
      return new Responsables([]);
    }
    if (!Array.isArray(leidas)) return new Responsables([]);
    const reglas = leidas.filter(
      (regla): regla is Regla =>
        typeof regla?.ruta === "string" &&
        Array.isArray(regla.responsables) &&
        regla.responsables.every((responsable: unknown) => typeof responsable === "string"),
    );
    return new Responsables(reglas);
  }

  de(ruta: string): string[] {
    let elegida: Regla | null = null;
    let mejor = -1;
    for (const regla of this.reglas) {
      const concrecion = this.concrecion(regla.ruta, ruta);
      if (concrecion >= mejor && concrecion >= 0) {
        elegida = regla;
        mejor = concrecion;
      }
    }
    return elegida ? [...elegida.responsables] : [];
  }

  esResponsableDeAlguno(usuario: string, rutas: string[]): boolean {
    return rutas.some((ruta) => this.de(ruta).includes(usuario));
  }

  private concrecion(patron: string, ruta: string): number {
    if (patron === "*") return 0;
    if (patron.endsWith("/")) return ruta.startsWith(patron) ? patron.length : -1;
    return patron === ruta ? patron.length + 1 : -1;
  }
}
