import { leerCabecera, tipoDePieza } from "./Pieza";

describe("tipoDePieza", () => {
  it.each([
    ["FORMATO.md", { tipo: "formato" }],
    ["responsables.yml", { tipo: "responsables" }],
    ["agentes/postventa/AGENTE.md", { tipo: "agente", agente: "postventa" }],
    ["agentes/postventa/casos/cambios-en-la-reserva/AREA.md", { tipo: "area", agente: "postventa", area: "cambios-en-la-reserva" }],
    [
      "agentes/postventa/casos/cambios-en-la-reserva/cambiar-fechas/SKILL.md",
      { tipo: "caso", agente: "postventa", area: "cambios-en-la-reserva", caso: "cambiar-fechas" },
    ],
    [
      "agentes/postventa/casos/cambios-en-la-reserva/cambiar-fechas/pruebas.md",
      { tipo: "pruebas", agente: "postventa", area: "cambios-en-la-reserva", caso: "cambiar-fechas" },
    ],
    ["informacion/comun/seguro.md", { tipo: "informacion", id: "comun/seguro", nombre: "seguro" }],
    ["avisos/lluvias.md", { tipo: "aviso", nombre: "lluvias" }],
    ["plantillas/ticket-duplicado.md", { tipo: "plantilla", nombre: "ticket-duplicado" }],
    ["acciones/reenviar-bono.md", { tipo: "accion", nombre: "reenviar-bono" }],
  ])("reconoce %s", (ruta, esperado) => {
    expect(tipoDePieza(ruta)).toEqual(esperado);
  });

  it.each([
    "README.md",
    "informacion/comun/sub/seguro.md",
    "informacion/seguro.md",
    "agentes/postventa/casos/cambios-en-la-reserva/cambiar-fechas/notas.md",
    "acciones/reenviar-bono.txt",
    "../fuera.md",
    "avisos/con espacio.md",
    "avisos/salto\nde-linea.md",
    "plantillas/con\ttabulador.md",
    "acciones/ñandú.md",
  ])("no reconoce %j", (ruta) => {
    expect(tipoDePieza(ruta)).toBeNull();
  });
});

describe("leerCabecera", () => {
  it("separa la cabecera YAML del cuerpo", () => {
    const leida = leerCabecera("---\nname: seguro\nmetadata:\n  acciones:\n    - a\n---\n## Texto\n\nCuerpo\n");

    expect(leida.cabecera).toEqual({ name: "seguro", metadata: { acciones: ["a"] } });
    expect(leida.cuerpo).toBe("## Texto\n\nCuerpo\n");
    expect(leida.error).toBeUndefined();
  });

  it("sin cabecera devuelve cabecera nula y todo como cuerpo", () => {
    const leida = leerCabecera("## Solo cuerpo\n");

    expect(leida.cabecera).toBeNull();
    expect(leida.cuerpo).toBe("## Solo cuerpo\n");
  });

  it("una cabecera sin cerrar es un error", () => {
    expect(leerCabecera("---\nname: x\n## cuerpo").error).toMatch(/cabecera sin cerrar/);
  });

  it("un YAML roto es un error, no una excepción", () => {
    const leida = leerCabecera("---\nname: [sin cerrar\n---\ncuerpo");

    expect(leida.cabecera).toBeNull();
    expect(leida.error).toMatch(/cabecera no es YAML válido/);
  });

  it("una cabecera que no es un mapa es un error", () => {
    expect(leerCabecera("---\n- a\n- b\n---\n").error).toMatch(/cabecera tiene que ser una lista de campos/);
  });
});
