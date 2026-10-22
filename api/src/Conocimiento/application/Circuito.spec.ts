import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { stringify } from "yaml";
import { DirectorioDeUsuarios } from "../domain/DirectorioDeUsuarios";
import { ErrorDeCircuito } from "../domain/Propuesta";
import { cabeceraDeCaso, conocimientoDePrueba, cuerpoDeCaso, informacion, md, RUTAS } from "../fixtures/conocimientoDePrueba";
import { AlmacenGit } from "../infrastructure/AlmacenGit";
import { RepositorioPropuestasEnMemoria } from "../infrastructure/RepositorioPropuestasEnMemoria";
import { USUARIOS_DE_LA_PRUEBA } from "../infrastructure/usuariosDeLaPrueba";
import { PeticionNoValida } from "./Errores";
import { ProponerCambio } from "./ProponerCambio";
import { RevisarPropuesta } from "./RevisarPropuesta";
import { VerHistorial } from "./VerHistorial";

describe("circuito de una propuesta", () => {
  const ahora = new Date("2026-10-22T10:00:00Z");
  let carpeta: string;
  let almacen: AlmacenGit;
  let propuestas: RepositorioPropuestasEnMemoria;
  let proponer: ProponerCambio;
  let revisar: RevisarPropuesta;
  let historial: VerHistorial;
  const usuarios = new DirectorioDeUsuarios(USUARIOS_DE_LA_PRUEBA);

  const arrancar = async (semilla = conocimientoDePrueba()) => {
    carpeta = await mkdtemp(join(tmpdir(), "travis-circuito-"));
    almacen = new AlmacenGit(join(carpeta, "conocimiento.git"));
    await almacen.inicializar(semilla, { nombre: "semilla", email: "semilla@travis.local" });
    propuestas = new RepositorioPropuestasEnMemoria();
    proponer = new ProponerCambio(almacen, propuestas, usuarios, () => ahora);
    revisar = new RevisarPropuesta(almacen, propuestas, usuarios, () => ahora);
    historial = new VerHistorial(almacen, propuestas);
  };

  const proponerInformacion = (autor = "booking-1", contenido = informacion("¿Se puede cambiar de hotel?")) =>
    proponer.ejecutar({ autor, titulo: "Aclara los cambios", cambios: [{ ruta: RUTAS.informacion, contenido }], origen: "visor" });

  beforeEach(() => arrancar());
  afterEach(() => rm(carpeta, { recursive: true, force: true }));

  it("proponer un cambio válido crea una propuesta abierta en su rama y no toca lo publicado", async () => {
    const { propuesta, problemas } = await proponerInformacion();

    expect(propuesta).toMatchObject({ id: 1, estado: "abierta", rama: "propuesta/1", autor: "booking-1", origen: "visor", ficheros: [RUTAS.informacion] });
    expect(problemas).toEqual([]);
    expect(await almacen.leer(RUTAS.informacion, "master")).toBe(informacion());
    expect(await almacen.leer(RUTAS.informacion, "propuesta/1")).toBe(informacion("¿Se puede cambiar de hotel?"));
  });

  it("dos propuestas a la vez reciben números y ramas distintos", async () => {
    const [una, otra] = await Promise.all([
      proponerInformacion("booking-1", informacion("¿Una?")),
      proponerInformacion("booking-2", informacion("¿Otra?")),
    ]);
    expect([una.propuesta.id, otra.propuesta.id].sort()).toEqual([1, 2]);
    expect(una.propuesta.rama).not.toBe(otra.propuesta.rama);
  });

  it("no acepta rutas fuera de la estructura, usuarios desconocidos ni propuestas sin título", async () => {
    await expect(proponer.ejecutar({ autor: "booking-1", titulo: "x", cambios: [{ ruta: "notas/idea.md", contenido: "x" }], origen: "visor" })).rejects.toThrow(
      PeticionNoValida,
    );
    await expect(proponerInformacion("fantasma")).rejects.toThrow(/usuario/);
    await expect(proponer.ejecutar({ autor: "booking-1", titulo: " ", cambios: [{ ruta: RUTAS.informacion, contenido: "x" }], origen: "visor" })).rejects.toThrow(
      /título/,
    );
    expect(await propuestas.listar()).toEqual([]);
  });

  it("los problemas de formato se ven al proponer y bloquean la publicación", async () => {
    const sinTitulo = md({ name: "cambios-de-reserva", description: "D" }, "## ¿x?\n");
    const { propuesta, problemas } = await proponerInformacion("booking-1", sinTitulo);
    expect(problemas).toEqual([{ ruta: RUTAS.informacion, mensaje: "falta titulo" }]);

    await revisar.marcarProbada(propuesta.id, "booking-1");
    await revisar.aprobar(propuesta.id, "booking-2");

    await expect(revisar.publicar(propuesta.id, "resp-booking")).rejects.toThrow(/validación de formato/);
    expect((await almacen.versionPublicada()).version).toBe(1);
  });

  it("solo cuenta los problemas que trae la propuesta, no los que ya estaban publicados", async () => {
    const semilla = conocimientoDePrueba();
    semilla.set("informacion/comun/rota.md", md({ name: "rota", description: "D" }, "## ¿x?\n"));
    await rm(carpeta, { recursive: true, force: true });
    await arrancar(semilla);

    expect((await proponerInformacion()).problemas).toEqual([]);
  });

  it("una propuesta se prueba, se aprueba y se publica como versión nueva", async () => {
    const { propuesta } = await proponerInformacion();
    expect((await revisar.detalle(propuesta.id)).pendientes).toEqual([
      "falta que quien hizo el cambio lo pruebe en Travis",
      `falta la aprobación de un responsable de ${RUTAS.informacion} (resp-booking, booking-2)`,
    ]);

    await revisar.marcarProbada(propuesta.id, "booking-1");
    await revisar.aprobar(propuesta.id, "booking-2");
    const publicada = await revisar.publicar(propuesta.id, "resp-booking");

    expect(publicada).toMatchObject({ estado: "publicada", version: 2, publicadaPor: "resp-booking" });
    expect(await almacen.leer(RUTAS.informacion, "master")).toBe(informacion("¿Se puede cambiar de hotel?"));
    const [ultima] = await historial.historial(RUTAS.informacion);
    expect(ultima).toMatchObject({ version: 2, publicadaPor: "resp-booking", propuesta: { id: 1, titulo: "Aclara los cambios", autor: "booking-1" } });
  });

  it("la aprobación la da un responsable publicado, aunque la propuesta cambie responsables.yml", async () => {
    const reglas = stringify([
      { ruta: "*", responsables: ["tecnico-1", "tecnico-2", "booking-2"] },
      { ruta: "informacion/", responsables: ["resp-booking", "booking-2"] },
    ]);
    const { propuesta } = await proponer.ejecutar({
      autor: "booking-1",
      titulo: "Me hago responsable de todo",
      cambios: [{ ruta: RUTAS.responsables, contenido: reglas }],
      origen: "visor",
    });

    await expect(revisar.aprobar(propuesta.id, "booking-2")).rejects.toThrow(ErrorDeCircuito);
  });

  it("la IA propone por el MCP y una persona lo prueba, lo aprueba y lo publica", async () => {
    const { propuesta } = await proponer.ejecutar({
      autor: "ia",
      titulo: "Propuesta desde un ticket resuelto a mano",
      cambios: [{ ruta: RUTAS.informacion, contenido: informacion("¿Puedo añadir una noche?") }],
      origen: "mcp",
    });
    expect(propuesta).toMatchObject({ autor: "ia", autorEsIA: true, origen: "mcp" });

    await expect(revisar.marcarProbada(propuesta.id, "ia")).rejects.toThrow(/una persona/);
    await revisar.marcarProbada(propuesta.id, "booking-1");
    await revisar.aprobar(propuesta.id, "booking-2");
    await expect(revisar.publicar(propuesta.id, "ia")).rejects.toThrow(/una persona/);
    expect((await revisar.publicar(propuesta.id, "resp-booking")).version).toBe(2);
  });

  it("dos publicaciones a la vez de la misma propuesta crean una sola versión", async () => {
    const { propuesta } = await proponerInformacion();
    await revisar.marcarProbada(propuesta.id, "booking-1");
    await revisar.aprobar(propuesta.id, "booking-2");

    const resultados = await Promise.allSettled([revisar.publicar(propuesta.id, "resp-booking"), revisar.publicar(propuesta.id, "resp-booking")]);

    expect(resultados.map((resultado) => resultado.status).sort()).toEqual(["fulfilled", "rejected"]);
    expect((await almacen.versionPublicada()).version).toBe(2);
  });

  it("el detalle dice qué ficheros cambian, cómo, quién los aprueba y qué pruebas se lanzarían", async () => {
    const caso = md(cabeceraDeCaso(), cuerpoDeCaso("\nOtra línea.\n"));
    const nueva = md({ name: "otra", titulo: "Otra", description: "Nueva" }, "Texto.\n");
    const { propuesta } = await proponer.ejecutar({
      autor: "booking-1",
      titulo: "Retoca el caso",
      cambios: [
        { ruta: RUTAS.caso, contenido: caso },
        { ruta: "plantillas/otra.md", contenido: nueva },
        { ruta: RUTAS.plantilla, contenido: null },
      ],
      origen: "visor",
    });

    const detalle = await revisar.detalle(propuesta.id);

    expect(detalle.ficheros.map(({ ruta, cambio, responsables }) => ({ ruta, cambio, responsables }))).toEqual([
      { ruta: RUTAS.caso, cambio: "cambiado", responsables: ["resp-booking", "booking-2"] },
      { ruta: "plantillas/otra.md", cambio: "nuevo", responsables: ["resp-booking", "booking-2"] },
      { ruta: RUTAS.plantilla, cambio: "borrado", responsables: ["resp-booking", "booking-2"] },
    ]);
    expect(detalle.ficheros[0].diferencias).toContain("+Otra línea.");
    expect(detalle.problemas).toContainEqual({ ruta: RUTAS.caso, mensaje: "la plantilla «reserva-nueva» no existe" });
    expect(detalle.pruebasAutomaticas).toEqual({
      disponible: false,
      motivo: expect.stringMatching(/Travis/),
      casos: [{ caso: "cambiar-fechas", ruta: RUTAS.pruebas, pruebas: 1 }],
    });
  });

  it("rechazar cierra la propuesta con su motivo", async () => {
    const { propuesta } = await proponerInformacion();
    const rechazada = await revisar.rechazar(propuesta.id, "booking-2", "Ya está en otro sitio");
    expect(rechazada).toMatchObject({ estado: "rechazada", rechazo: { usuario: "booking-2", motivo: "Ya está en otro sitio" } });
    await expect(revisar.publicar(propuesta.id, "resp-booking")).rejects.toThrow(/rechazada/);
  });

  it("volver a una versión anterior es otra propuesta con el contenido de entonces", async () => {
    const { propuesta } = await proponerInformacion();
    await revisar.marcarProbada(propuesta.id, "booking-1");
    await revisar.aprobar(propuesta.id, "booking-2");
    await revisar.publicar(propuesta.id, "resp-booking");

    const deEntonces = await historial.enVersion(RUTAS.informacion, 1);
    const vuelta = await proponer.ejecutar({ autor: "booking-1", titulo: "Vuelve a la v1", cambios: [{ ruta: RUTAS.informacion, contenido: deEntonces! }], origen: "visor" });

    expect(vuelta.propuesta.base).toBe((await almacen.versionPublicada()).commit);
    expect(await almacen.leer(RUTAS.informacion, vuelta.propuesta.rama)).toBe(informacion());
    expect(await historial.diferencias(RUTAS.informacion, 1, 2)).toContain("+## ¿Se puede cambiar de hotel?");
  });
});
