import { stringify } from "yaml";
import { Responsables } from "./Responsables";

const desde = (reglas: unknown) => Responsables.desdeYaml(stringify(reglas));

describe("Responsables", () => {
  const responsables = desde([
    { ruta: "*", responsables: ["tecnico-1"] },
    { ruta: "agentes/postventa/casos/", responsables: ["resp-booking", "booking-2"] },
    { ruta: "agentes/postventa/casos/parques/", responsables: ["resp-booking", "booking-1"] },
    { ruta: "agentes/postventa/AGENTE.md", responsables: ["tecnico-1", "resp-booking"] },
  ]);

  it("lo que no cubre ninguna regla concreta cae en «*»", () => {
    expect(responsables.de("acciones/reenviar-bono.md")).toEqual(["tecnico-1"]);
  });

  it("una carpeta cubre todo lo que hay dentro", () => {
    expect(responsables.de("agentes/postventa/casos/cambios/cambiar-fechas/SKILL.md")).toEqual(["resp-booking", "booking-2"]);
  });

  it("gana la carpeta más concreta", () => {
    expect(responsables.de("agentes/postventa/casos/parques/canjear/SKILL.md")).toEqual(["resp-booking", "booking-1"]);
  });

  it("un fichero exacto gana a su carpeta", () => {
    expect(responsables.de("agentes/postventa/AGENTE.md")).toEqual(["tecnico-1", "resp-booking"]);
  });

  it("una carpeta no cubre un fichero que solo empieza igual", () => {
    expect(responsables.de("agentes/postventa/casos-viejos/x.md")).toEqual(["tecnico-1"]);
  });

  it("a igual concreción gana la última regla", () => {
    const repetidas = desde([
      { ruta: "*", responsables: ["a"] },
      { ruta: "*", responsables: ["b"] },
    ]);
    expect(repetidas.de("FORMATO.md")).toEqual(["b"]);
  });

  it("un fichero roto no da responsables a nadie", () => {
    expect(Responsables.desdeYaml("ruta: [roto").de("FORMATO.md")).toEqual([]);
    expect(Responsables.desdeYaml("ruta: x\n").de("FORMATO.md")).toEqual([]);
  });

  it("dice si alguien es responsable de alguno de unos ficheros", () => {
    expect(responsables.esResponsableDeAlguno("booking-2", ["acciones/x.md", "agentes/postventa/casos/cambios/a/SKILL.md"])).toBe(true);
    expect(responsables.esResponsableDeAlguno("booking-2", ["acciones/x.md"])).toBe(false);
  });
});
