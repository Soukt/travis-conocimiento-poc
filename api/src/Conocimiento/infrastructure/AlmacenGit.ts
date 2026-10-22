import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { access, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { AlmacenConocimiento, Cambio, EntradaHistorial, ErrorDeAlmacen, Firma } from "../domain/AlmacenConocimiento";

const MASTER = "refs/heads/master";
const SIN_COMMIT = "0".repeat(40);

type Salida = { codigo: number; stdout: Buffer; stderr: string };

// Git sin copia de trabajo: cada escritura arma su árbol en un índice temporal, así varias propuestas
// conviven sin pisarse y master solo cambia al publicar.
export class AlmacenGit implements AlmacenConocimiento {
  private cola: Promise<unknown> = Promise.resolve();
  private readonly arboles = new Map<string, Map<string, string>>();

  constructor(private readonly carpeta: string) {}

  async inicializar(semilla: ReadonlyMap<string, string>, firma: Firma): Promise<void> {
    return this.enCola(async () => {
      if (!(await this.existe(join(this.carpeta, "HEAD")))) {
        await mkdir(dirname(this.carpeta), { recursive: true });
        await this.ejecutarOFallar(["init", "--bare", "--initial-branch=master", this.carpeta], { sinGitDir: true });
      }
      if (await this.resolver(MASTER)) return;

      const cambios = [...semilla].map(([ruta, contenido]) => ({ ruta, contenido }));
      const arbol = await this.escribirArbol(null, cambios);
      const commit = await this.commit(arbol, [], firma, "Carga inicial del conocimiento");
      await this.git(["update-ref", MASTER, commit, SIN_COMMIT]);
      await this.git(["tag", "v1", commit]);
    });
  }

  async cabeza(ref: string): Promise<string> {
    const commit = await this.resolver(ref);
    if (!commit) throw new ErrorDeAlmacen(`no existe ${ref}`);
    return commit;
  }

  async versionPublicada(): Promise<{ version: number; commit: string }> {
    const versiones = await this.versiones();
    return { version: Math.max(0, ...versiones.values()), commit: await this.cabeza("master") };
  }

  async leerArbol(ref: string): Promise<Map<string, string>> {
    const commit = await this.cabeza(ref);
    const guardado = this.arboles.get(commit);
    if (guardado) return new Map(guardado);

    const listado = await this.git(["ls-tree", "-r", "-z", "--full-tree", commit]);
    const entradas = listado
      .split("\0")
      .filter(Boolean)
      .map((linea) => {
        const [cabecera, ruta] = linea.split("\t");
        return { sha: cabecera.split(" ")[2], ruta };
      });
    const contenidos = await this.leerBlobs(entradas.map((entrada) => entrada.sha));
    const arbol = new Map(entradas.map((entrada, indice) => [entrada.ruta, contenidos[indice]]));
    this.arboles.set(commit, arbol);
    return new Map(arbol);
  }

  async leer(ruta: string, ref: string): Promise<string | null> {
    const salida = await this.ejecutar(["cat-file", "-p", `${ref}:${ruta}`]);
    return salida.codigo === 0 ? salida.stdout.toString("utf8") : null;
  }

  async crearRama(rama: string, base: string, cambios: Cambio[], firma: Firma, mensaje: string) {
    return this.enCola(async () => {
      const referencia = `refs/heads/${rama}`;
      if ((await this.ejecutar(["check-ref-format", referencia])).codigo !== 0) throw new ErrorDeAlmacen(`nombre de rama no válido: ${rama}`);
      if (await this.resolver(referencia)) throw new ErrorDeAlmacen(`la rama ${rama} ya existe`);

      const commitBase = await this.cabeza(base);
      const arbol = await this.escribirArbol(commitBase, cambios);
      if (arbol === (await this.git(["rev-parse", `${commitBase}^{tree}`])).trim()) {
        throw new ErrorDeAlmacen("la propuesta no cambia nada respecto a lo publicado");
      }
      const commit = await this.commit(arbol, [commitBase], firma, mensaje);
      await this.git(["update-ref", referencia, commit, SIN_COMMIT]);
      const ficheros = (await this.git(["diff", "--name-only", "--no-renames", commitBase, commit])).split("\n").filter(Boolean).sort();
      return { commit, ficheros };
    });
  }

  async diferencias(desde: string, hasta: string, ruta?: string): Promise<string> {
    return this.git(["diff", "--no-color", "--no-ext-diff", "--no-renames", desde, hasta, ...(ruta ? ["--", ruta] : [])]);
  }

  async publicar(rama: string, firma: Firma, mensaje: string) {
    return this.enCola(async () => {
      const master = await this.cabeza("master");
      const punta = await this.cabeza(`refs/heads/${rama}`);
      if ((await this.ejecutar(["merge-base", "--is-ancestor", punta, master])).codigo === 0) {
        throw new ErrorDeAlmacen(`la rama ${rama} ya está publicada`);
      }

      let arbol: string;
      if ((await this.ejecutar(["merge-base", "--is-ancestor", master, punta])).codigo === 0) {
        arbol = (await this.git(["rev-parse", `${punta}^{tree}`])).trim();
      } else {
        const fusion = await this.ejecutar(["merge-tree", "--write-tree", "--name-only", "--no-messages", master, punta]);
        const [primera, ...resto] = fusion.stdout.toString("utf8").split("\n").filter(Boolean);
        if (fusion.codigo === 1) {
          throw new ErrorDeAlmacen(`la propuesta choca con lo publicado desde que se hizo: ${resto.join(", ")}`);
        }
        if (fusion.codigo !== 0) throw new ErrorDeAlmacen(`no se pudo fusionar: ${fusion.stderr.trim()}`);
        arbol = primera;
      }

      const commit = await this.commit(arbol, [master, punta], firma, mensaje);
      await this.git(["update-ref", MASTER, commit, master]);
      const version = Math.max(0, ...(await this.versiones()).values()) + 1;
      await this.git(["tag", `v${version}`, commit]);
      return { commit, version };
    });
  }

  async historial(ruta?: string): Promise<EntradaHistorial[]> {
    const versiones = await this.versiones();
    const salida = await this.git([
      "log",
      "--first-parent",
      "-m",
      "--format=%H%x1f%an%x1f%aI%x1f%s%x1e",
      "master",
      ...(ruta ? ["--", ruta] : []),
    ]);
    return salida
      .split("\x1e")
      .map((registro) => registro.trim())
      .filter(Boolean)
      .map((registro) => {
        const [commit, autor, fecha, mensaje] = registro.split("\x1f");
        return { commit, version: versiones.get(commit) ?? null, autor, fecha, mensaje };
      });
  }

  private async versiones(): Promise<Map<string, number>> {
    const salida = await this.git(["for-each-ref", "--format=%(refname:short) %(objectname)", "refs/tags/v*"]);
    const versiones = new Map<string, number>();
    for (const linea of salida.split("\n").filter(Boolean)) {
      const [etiqueta, commit] = linea.split(" ");
      const numero = Number(etiqueta.slice(1));
      if (Number.isInteger(numero)) versiones.set(commit, numero);
    }
    return versiones;
  }

  private async escribirArbol(base: string | null, cambios: Cambio[]): Promise<string> {
    const indice = join(this.carpeta, `indice-${randomUUID()}`);
    const env = { GIT_INDEX_FILE: indice };
    try {
      await this.git(base ? ["read-tree", base] : ["read-tree", "--empty"], { env });
      const lineas: string[] = [];
      for (const cambio of cambios) {
        if (cambio.contenido === null) {
          lineas.push(`0 ${SIN_COMMIT}\t${cambio.ruta}`);
        } else {
          const sha = (await this.git(["hash-object", "-w", "--stdin"], { entrada: cambio.contenido })).trim();
          lineas.push(`100644 ${sha}\t${cambio.ruta}`);
        }
      }
      if (lineas.length > 0) await this.git(["update-index", "--index-info"], { env, entrada: `${lineas.join("\n")}\n` });
      return (await this.git(["write-tree"], { env })).trim();
    } finally {
      await rm(indice, { force: true });
    }
  }

  private async commit(arbol: string, padres: string[], firma: Firma, mensaje: string): Promise<string> {
    const env = {
      GIT_AUTHOR_NAME: firma.nombre,
      GIT_AUTHOR_EMAIL: firma.email,
      GIT_COMMITTER_NAME: firma.nombre,
      GIT_COMMITTER_EMAIL: firma.email,
    };
    const argumentos = ["commit-tree", "--no-gpg-sign", arbol, ...padres.flatMap((padre) => ["-p", padre]), "-m", mensaje];
    return (await this.git(argumentos, { env })).trim();
  }

  private async leerBlobs(shas: string[]): Promise<string[]> {
    if (shas.length === 0) return [];
    const datos = await this.gitEnBruto(["cat-file", "--batch"], { entrada: `${shas.join("\n")}\n` });
    const contenidos: string[] = [];
    let posicion = 0;
    while (contenidos.length < shas.length) {
      const finCabecera = datos.indexOf(0x0a, posicion);
      const tamano = Number(datos.subarray(posicion, finCabecera).toString("utf8").split(" ")[2]);
      const inicio = finCabecera + 1;
      contenidos.push(datos.subarray(inicio, inicio + tamano).toString("utf8"));
      posicion = inicio + tamano + 1;
    }
    return contenidos;
  }

  private async resolver(ref: string): Promise<string | null> {
    const salida = await this.ejecutar(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`]);
    return salida.codigo === 0 ? salida.stdout.toString("utf8").trim() : null;
  }

  private async existe(ruta: string): Promise<boolean> {
    return access(ruta).then(
      () => true,
      () => false,
    );
  }

  private enCola<T>(trabajo: () => Promise<T>): Promise<T> {
    const resultado = this.cola.then(trabajo, trabajo);
    this.cola = resultado.catch(() => undefined);
    return resultado;
  }

  private async git(argumentos: string[], opciones: { entrada?: string; env?: Record<string, string> } = {}): Promise<string> {
    return (await this.gitEnBruto(argumentos, opciones)).toString("utf8");
  }

  private async gitEnBruto(argumentos: string[], opciones: { entrada?: string; env?: Record<string, string> } = {}): Promise<Buffer> {
    return (await this.ejecutarOFallar(argumentos, opciones)).stdout;
  }

  private async ejecutarOFallar(
    argumentos: string[],
    opciones: { entrada?: string; env?: Record<string, string>; sinGitDir?: boolean } = {},
  ): Promise<Salida> {
    const salida = await this.ejecutar(argumentos, opciones);
    if (salida.codigo !== 0) throw new ErrorDeAlmacen(`git ${argumentos[0]} falló: ${salida.stderr.trim()}`);
    return salida;
  }

  private ejecutar(
    argumentos: string[],
    opciones: { entrada?: string; env?: Record<string, string>; sinGitDir?: boolean } = {},
  ): Promise<Salida> {
    return new Promise((resolver, rechazar) => {
      const proceso = spawn("git", opciones.sinGitDir ? argumentos : ["--git-dir", this.carpeta, ...argumentos], {
        env: { ...process.env, GIT_TERMINAL_PROMPT: "0", ...opciones.env },
      });
      const trozos: Buffer[] = [];
      let errores = "";
      proceso.stdout.on("data", (trozo: Buffer) => trozos.push(trozo));
      proceso.stderr.on("data", (trozo: Buffer) => (errores += trozo.toString("utf8")));
      proceso.on("error", rechazar);
      proceso.on("close", (codigo) => resolver({ codigo: codigo ?? 1, stdout: Buffer.concat(trozos), stderr: errores }));
      proceso.stdin.end(opciones.entrada ?? "");
    });
  }
}
