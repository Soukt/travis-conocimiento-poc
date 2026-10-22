import { parse, stringify } from "yaml";

export type Cabecera = Record<string, unknown>;

export function separar(texto: string): { cabecera: Cabecera; cuerpo: string } | { error: string } {
  if (!texto.startsWith("---\n")) return { cabecera: {}, cuerpo: texto };
  const cierre = texto.indexOf("\n---", 3);
  if (cierre === -1) return { error: "La cabecera no está cerrada con ---" };
  const finDeLinea = texto.indexOf("\n", cierre + 4);
  try {
    const cabecera = parse(texto.slice(4, cierre + 1)) ?? {};
    if (typeof cabecera !== "object" || Array.isArray(cabecera)) return { error: "La cabecera tiene que ser una lista de campos" };
    return { cabecera: cabecera as Cabecera, cuerpo: finDeLinea === -1 ? "" : texto.slice(finDeLinea + 1) };
  } catch (error) {
    return { error: `La cabecera no es YAML válido: ${(error as Error).message.split("\n")[0]}` };
  }
}

// lineWidth 0: no partir las líneas largas de la cabecera, que es lo que hacía Decap y ensuciaba las diferencias.
export function unir(cabecera: Cabecera, cuerpo: string): string {
  const texto = cuerpo.length === 0 || cuerpo.endsWith("\n") ? cuerpo : `${cuerpo}\n`;
  return `---\n${stringify(cabecera, { lineWidth: 0 })}---\n${texto}`;
}

export function aNombre(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}
