import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Propuesta } from "../domain/Propuesta";
import { RepositorioPropuestasJson } from "./RepositorioPropuestasJson";

const nueva = (id: number) =>
  Propuesta.nueva({
    id,
    titulo: `Propuesta ${id}`,
    descripcion: "",
    autor: { id: "booking-1", nombre: "B1", rol: "r" },
    origen: "visor",
    rama: `propuesta/${id}`,
    base: "abc",
    ficheros: ["plantillas/x.md"],
    creadaEn: new Date("2026-10-22T10:00:00Z"),
  });

describe("RepositorioPropuestasJson", () => {
  let carpeta: string;
  let fichero: string;

  beforeEach(async () => {
    carpeta = await mkdtemp(join(tmpdir(), "travis-propuestas-"));
    fichero = join(carpeta, "propuestas.json");
  });
  afterEach(() => rm(carpeta, { recursive: true, force: true }));

  it("sin fichero empieza vacío y por el 1", async () => {
    const repositorio = new RepositorioPropuestasJson(fichero);
    expect(await repositorio.listar()).toEqual([]);
    expect(await repositorio.siguienteId()).toBe(1);
  });

  it("guarda, actualiza y recupera aunque se cree otra instancia", async () => {
    const repositorio = new RepositorioPropuestasJson(fichero);
    const propuesta = nueva(1);
    await repositorio.guardar(propuesta);
    await repositorio.guardar(nueva(2));
    propuesta.marcarProbada({ id: "booking-1", nombre: "B1", rol: "r" }, new Date("2026-10-22T11:00:00Z"));
    await repositorio.guardar(propuesta);

    const otra = new RepositorioPropuestasJson(fichero);
    expect((await otra.buscar(1))?.datos()).toEqual(propuesta.datos());
    expect((await otra.listar()).map((leida) => leida.id)).toEqual([1, 2]);
    expect(await otra.siguienteId()).toBe(3);
    expect(await otra.buscar(9)).toBeNull();
  });

  it("guardar a la vez no pierde ninguna propuesta", async () => {
    const repositorio = new RepositorioPropuestasJson(fichero);
    await Promise.all([1, 2, 3, 4, 5].map((id) => repositorio.guardar(nueva(id))));
    expect((await repositorio.listar()).length).toBe(5);
  });
});
