import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DirectorioDeUsuarios } from "../domain/DirectorioDeUsuarios";
import { conocimientoDePrueba, informacion, md, RUTAS } from "../fixtures/conocimientoDePrueba";
import { AlmacenGit } from "../infrastructure/AlmacenGit";
import { USUARIOS_DE_LA_PRUEBA } from "../infrastructure/usuariosDeLaPrueba";
import { ValidarBorrador } from "./ValidarBorrador";

describe("ValidarBorrador", () => {
  let carpeta: string;
  let almacen: AlmacenGit;
  let validar: ValidarBorrador;

  beforeEach(async () => {
    carpeta = await mkdtemp(join(tmpdir(), "travis-borrador-"));
    almacen = new AlmacenGit(join(carpeta, "conocimiento.git"));
    await almacen.inicializar(conocimientoDePrueba(), { nombre: "semilla", email: "semilla@travis.local" });
    validar = new ValidarBorrador(almacen, new DirectorioDeUsuarios(USUARIOS_DE_LA_PRUEBA));
  });
  afterEach(() => rm(carpeta, { recursive: true, force: true }));

  it("un borrador correcto no tiene problemas y no crea nada", async () => {
    const antes = await almacen.cabeza("master");
    expect(await validar.ejecutar([{ ruta: RUTAS.informacion, contenido: informacion("¿Otra?") }])).toEqual([]);
    expect(await almacen.cabeza("master")).toBe(antes);
  });

  it("devuelve los problemas que trae el borrador sobre lo publicado", async () => {
    const problemas = await validar.ejecutar([{ ruta: RUTAS.informacion, contenido: md({ name: "cambios-de-reserva", description: "D" }, "## ¿x?\n") }]);
    expect(problemas).toEqual([{ ruta: RUTAS.informacion, mensaje: "falta titulo" }]);
  });

  it("borrar algo que otros citan sale como problema en quien lo cita", async () => {
    const problemas = await validar.ejecutar([{ ruta: RUTAS.plantilla, contenido: null }]);
    expect(problemas).toEqual([{ ruta: RUTAS.caso, mensaje: "la plantilla «reserva-nueva» no existe" }]);
  });
});
