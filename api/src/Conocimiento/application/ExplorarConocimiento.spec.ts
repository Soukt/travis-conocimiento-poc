import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { conocimientoDePrueba, RUTAS } from "../fixtures/conocimientoDePrueba";
import { AlmacenGit } from "../infrastructure/AlmacenGit";
import { NoEncontrado } from "./Errores";
import { ExplorarConocimiento } from "./ExplorarConocimiento";

describe("ExplorarConocimiento", () => {
  let carpeta: string;
  let explorar: ExplorarConocimiento;

  beforeAll(async () => {
    carpeta = await mkdtemp(join(tmpdir(), "travis-explorar-"));
    const almacen = new AlmacenGit(join(carpeta, "conocimiento.git"));
    await almacen.inicializar(conocimientoDePrueba(), { nombre: "semilla", email: "semilla@travis.local" });
    explorar = new ExplorarConocimiento(almacen);
  });

  afterAll(() => rm(carpeta, { recursive: true, force: true }));

  it("lista cada pieza con su tipo y su título", async () => {
    const listado = await explorar.listado();

    expect(listado).toContainEqual(expect.objectContaining({ ruta: RUTAS.caso, tipo: "caso", titulo: "cambiar-fechas", area: "cambios", modo: "copiloto" }));
    expect(listado).toContainEqual(expect.objectContaining({ ruta: RUTAS.informacion, tipo: "informacion", titulo: "Cambios de reserva" }));
    expect(listado).toContainEqual(expect.objectContaining({ ruta: RUTAS.aviso, tipo: "aviso", desde: "2026-10-20", hasta: "2026-10-26" }));
  });

  it("el título de un caso sale de metadata.titulo cuando lo tiene", async () => {
    const carpetaConTitulo = await mkdtemp(join(tmpdir(), "travis-titulo-"));
    const semilla = conocimientoDePrueba();
    semilla.set(RUTAS.caso, semilla.get(RUTAS.caso)!.replace("  modo: copiloto", "  titulo: Cambiar las fechas de una reserva\n  modo: copiloto"));
    const almacen = new AlmacenGit(join(carpetaConTitulo, "conocimiento.git"));
    await almacen.inicializar(semilla, { nombre: "semilla", email: "semilla@travis.local" });

    const listado = await new ExplorarConocimiento(almacen).listado();

    expect(listado.find((pieza) => pieza.ruta === RUTAS.caso)?.titulo).toBe("Cambiar las fechas de una reserva");
    await rm(carpetaConTitulo, { recursive: true, force: true });
  });

  it("genera el índice de áreas a partir de los AREA.md, con cuántos casos tiene cada una", async () => {
    expect(await explorar.indiceDeAreas()).toEqual([
      { agente: "postventa", area: "cambios", titulo: "Cambios en la reserva", descripcion: "Cambiar fechas o servicios", casos: 1 },
    ]);
  });

  it("un caso trae sus pruebas, lo que cita con su título y sus responsables", async () => {
    const pieza = await explorar.pieza(RUTAS.caso);

    expect(pieza.pruebas).toEqual([{ pregunta: "¿Puedo cambiar las fechas?", esperado: "Lo pasa a booking" }]);
    expect(pieza.rutaPruebas).toBe(RUTAS.pruebas);
    expect(pieza.responsables).toEqual(["resp-booking", "booking-2"]);
    expect(pieza.citas).toEqual([
      { tipo: "accion", nombre: "verificar-identidad", ruta: "acciones/verificar-identidad.md", titulo: "Comprueba que es el titular", existe: true },
      { tipo: "accion", nombre: "crear-ticket-booking", ruta: RUTAS.accion, titulo: "Crea un ticket para booking", existe: true },
      { tipo: "informacion", nombre: "comun/cambios-de-reserva", ruta: RUTAS.informacion, titulo: "Cambios de reserva", existe: true },
      { tipo: "plantilla", nombre: "reserva-nueva", ruta: RUTAS.plantilla, titulo: "Reserva nueva", existe: true },
    ]);
  });

  it("una información dice qué casos la citan", async () => {
    const pieza = await explorar.pieza(RUTAS.informacion);
    expect(pieza.citadaPor.map((cita) => cita.ruta)).toEqual([RUTAS.caso]);
  });

  it("una pieza que no existe es un no encontrado", async () => {
    await expect(explorar.pieza("informacion/comun/nada.md")).rejects.toThrow(NoEncontrado);
  });

  it("busca sin importar tildes ni mayúsculas, y devuelve un trozo del texto", async () => {
    const resultados = await explorar.buscar("GESTIONA booking");
    expect(resultados).toContainEqual(expect.objectContaining({ ruta: RUTAS.informacion, fragmento: expect.stringContaining("lo gestiona booking") }));
    expect((await explorar.buscar("atraccion")).map((resultado) => resultado.ruta)).toEqual([RUTAS.avisoCaducado]);
  });

  it("los avisos vigentes son los que incluyen la fecha", async () => {
    expect((await explorar.avisosVigentes("2026-10-22")).map((aviso) => aviso.ruta)).toEqual([RUTAS.aviso]);
    expect((await explorar.avisosVigentes("2026-10-26")).map((aviso) => aviso.ruta)).toEqual([RUTAS.aviso]);
    expect(await explorar.avisosVigentes("2026-10-27")).toEqual([]);
  });
});
