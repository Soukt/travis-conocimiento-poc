import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

export async function leerCarpeta(raiz: string): Promise<Map<string, string>> {
  const arbol = new Map<string, string>();
  const recorrer = async (carpeta: string) => {
    for (const entrada of await readdir(carpeta, { withFileTypes: true })) {
      const ruta = join(carpeta, entrada.name);
      if (entrada.isDirectory()) await recorrer(ruta);
      else if (entrada.isFile() && entrada.name !== ".DS_Store") arbol.set(relative(raiz, ruta).split(sep).join("/"), await readFile(ruta, "utf8"));
    }
  };
  await recorrer(raiz);
  return arbol;
}
