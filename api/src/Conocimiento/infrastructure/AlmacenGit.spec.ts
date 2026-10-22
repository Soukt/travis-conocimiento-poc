import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ErrorDeAlmacen } from "../domain/AlmacenConocimiento";
import { AlmacenGit } from "./AlmacenGit";

const semilla = () =>
  new Map([
    ["FORMATO.md", "# Formato\n"],
    ["informacion/comun/seguro.md", "linea 1\nlinea 2\nlinea 3\n"],
    ["plantillas/hola.md", "Hola\n"],
  ]);

const booking1 = { nombre: "booking-1", email: "booking-1@travis.local" };
const resp = { nombre: "resp-booking", email: "resp-booking@travis.local" };

describe("AlmacenGit", () => {
  let carpeta: string;
  let almacen: AlmacenGit;

  beforeEach(async () => {
    carpeta = await mkdtemp(join(tmpdir(), "travis-almacen-"));
    almacen = new AlmacenGit(join(carpeta, "conocimiento.git"));
    await almacen.inicializar(semilla(), resp);
  });

  afterEach(async () => {
    await rm(carpeta, { recursive: true, force: true });
  });

  it("la primera vez carga la semilla en master como versión 1", async () => {
    expect(await almacen.versionPublicada()).toEqual({ version: 1, commit: await almacen.cabeza("master") });
    expect(await almacen.leerArbol("master")).toEqual(semilla());
  });

  it("si ya hay conocimiento, no lo vuelve a cargar", async () => {
    const antes = await almacen.cabeza("master");
    await almacen.inicializar(new Map([["otra.md", "x"]]), resp);
    expect(await almacen.cabeza("master")).toBe(antes);
  });

  it("una propuesta es una rama nueva y master no cambia", async () => {
    const base = await almacen.cabeza("master");
    const { commit, ficheros } = await almacen.crearRama(
      "propuesta/1",
      base,
      [{ ruta: "informacion/comun/seguro.md", contenido: "linea 1\nlinea 2 cambiada\nlinea 3\n" }],
      booking1,
      "Cambia el seguro",
    );

    expect(ficheros).toEqual(["informacion/comun/seguro.md"]);
    expect(await almacen.cabeza("propuesta/1")).toBe(commit);
    expect(await almacen.cabeza("master")).toBe(base);
    expect(await almacen.leer("informacion/comun/seguro.md", "master")).toBe("linea 1\nlinea 2\nlinea 3\n");
    expect(await almacen.leer("informacion/comun/seguro.md", "propuesta/1")).toBe("linea 1\nlinea 2 cambiada\nlinea 3\n");
    const diferencias = await almacen.diferencias(base, "propuesta/1");
    expect(diferencias).toContain("-linea 2\n+linea 2 cambiada");
  });

  it("una propuesta puede crear y borrar ficheros", async () => {
    const base = await almacen.cabeza("master");
    const { ficheros } = await almacen.crearRama(
      "propuesta/1",
      base,
      [
        { ruta: "plantillas/hola.md", contenido: null },
        { ruta: "plantillas/adios.md", contenido: "Adiós\n" },
      ],
      booking1,
      "Cambia plantillas",
    );

    expect(ficheros).toEqual(["plantillas/adios.md", "plantillas/hola.md"]);
    const arbol = await almacen.leerArbol("propuesta/1");
    expect(arbol.has("plantillas/hola.md")).toBe(false);
    expect(arbol.get("plantillas/adios.md")).toBe("Adiós\n");
  });

  it("una propuesta que no cambia nada no se crea", async () => {
    const base = await almacen.cabeza("master");
    await expect(
      almacen.crearRama("propuesta/1", base, [{ ruta: "plantillas/hola.md", contenido: "Hola\n" }], booking1, "Nada"),
    ).rejects.toThrow(ErrorDeAlmacen);
  });

  it("no se pisa una rama que ya existe", async () => {
    const base = await almacen.cabeza("master");
    await almacen.crearRama("propuesta/1", base, [{ ruta: "plantillas/hola.md", contenido: "A\n" }], booking1, "A");
    await expect(
      almacen.crearRama("propuesta/1", base, [{ ruta: "plantillas/hola.md", contenido: "B\n" }], booking1, "B"),
    ).rejects.toThrow(/ya existe/);
  });

  it("publicar fusiona la rama en master y crea la versión siguiente", async () => {
    const base = await almacen.cabeza("master");
    await almacen.crearRama("propuesta/1", base, [{ ruta: "plantillas/hola.md", contenido: "Hola, ¿qué tal?\n" }], booking1, "Saludo");

    const publicada = await almacen.publicar("propuesta/1", resp, "Publica la propuesta 1");

    expect(publicada.version).toBe(2);
    expect(await almacen.versionPublicada()).toEqual({ version: 2, commit: publicada.commit });
    expect(await almacen.leer("plantillas/hola.md", "master")).toBe("Hola, ¿qué tal?\n");
    expect(await almacen.leer("plantillas/hola.md", "v1")).toBe("Hola\n");
  });

  it("publicar cuando master ya ha cambiado junta los dos cambios", async () => {
    const base = await almacen.cabeza("master");
    await almacen.crearRama("propuesta/1", base, [{ ruta: "plantillas/hola.md", contenido: "Hola 1\n" }], booking1, "Uno");
    await almacen.crearRama(
      "propuesta/2",
      base,
      [{ ruta: "informacion/comun/seguro.md", contenido: "linea 1\nlinea 2\nlinea 3\nlinea 4\n" }],
      booking1,
      "Dos",
    );
    await almacen.publicar("propuesta/1", resp, "Publica 1");

    const publicada = await almacen.publicar("propuesta/2", resp, "Publica 2");

    expect(publicada.version).toBe(3);
    expect(await almacen.leer("plantillas/hola.md", "master")).toBe("Hola 1\n");
    expect(await almacen.leer("informacion/comun/seguro.md", "master")).toBe("linea 1\nlinea 2\nlinea 3\nlinea 4\n");
  });

  it("si dos propuestas cambian lo mismo, la segunda no se publica y master queda igual", async () => {
    const base = await almacen.cabeza("master");
    await almacen.crearRama("propuesta/1", base, [{ ruta: "plantillas/hola.md", contenido: "Hola 1\n" }], booking1, "Uno");
    await almacen.crearRama("propuesta/2", base, [{ ruta: "plantillas/hola.md", contenido: "Hola 2\n" }], booking1, "Dos");
    await almacen.publicar("propuesta/1", resp, "Publica 1");
    const master = await almacen.cabeza("master");

    await expect(almacen.publicar("propuesta/2", resp, "Publica 2")).rejects.toThrow(/choca.*plantillas\/hola.md/);
    expect(await almacen.cabeza("master")).toBe(master);
    expect((await almacen.versionPublicada()).version).toBe(2);
  });

  it("una rama ya publicada no se vuelve a publicar ni crea otra versión", async () => {
    const base = await almacen.cabeza("master");
    await almacen.crearRama("propuesta/1", base, [{ ruta: "plantillas/hola.md", contenido: "Hola 1\n" }], booking1, "Uno");
    await almacen.publicar("propuesta/1", resp, "Publica 1");

    await expect(almacen.publicar("propuesta/1", resp, "Otra vez")).rejects.toThrow(/ya está publicada/);
    expect((await almacen.versionPublicada()).version).toBe(2);
  });

  it("el historial de un fichero lista las versiones que lo cambiaron, con quién publicó", async () => {
    const base = await almacen.cabeza("master");
    await almacen.crearRama("propuesta/1", base, [{ ruta: "plantillas/hola.md", contenido: "Hola 1\n" }], booking1, "Uno");
    await almacen.publicar("propuesta/1", resp, "Publica 1");
    const base2 = await almacen.cabeza("master");
    await almacen.crearRama("propuesta/2", base2, [{ ruta: "informacion/comun/seguro.md", contenido: "otra\n" }], booking1, "Dos");
    await almacen.publicar("propuesta/2", resp, "Publica 2");

    const historial = await almacen.historial("plantillas/hola.md");

    expect(historial.map((entrada) => [entrada.version, entrada.autor, entrada.mensaje])).toEqual([
      [2, "resp-booking", "Publica 1"],
      [1, "resp-booking", "Carga inicial del conocimiento"],
    ]);
  });

  it("las diferencias entre dos versiones de un fichero", async () => {
    const base = await almacen.cabeza("master");
    await almacen.crearRama("propuesta/1", base, [{ ruta: "plantillas/hola.md", contenido: "Hola 1\n" }], booking1, "Uno");
    await almacen.publicar("propuesta/1", resp, "Publica 1");

    expect(await almacen.diferencias("v1", "v2", "plantillas/hola.md")).toContain("-Hola\n+Hola 1");
  });

  it("leer un fichero que no existe devuelve null", async () => {
    expect(await almacen.leer("nada.md", "master")).toBeNull();
  });
});
