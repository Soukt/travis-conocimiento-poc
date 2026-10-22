import { stringify } from "yaml";
import { ErrorDeCircuito, Propuesta } from "./Propuesta";
import { Responsables } from "./Responsables";
import { Usuario } from "./Usuario";

const usuario = (id: string, esIA = false): Usuario => ({ id, nombre: id, rol: "rol", esIA });
const booking1 = usuario("booking-1");
const booking2 = usuario("booking-2");
const respBooking = usuario("resp-booking");
const tecnico1 = usuario("tecnico-1");
const ia = usuario("ia", true);

const responsables = Responsables.desdeYaml(
  stringify([
    { ruta: "*", responsables: ["tecnico-1", "tecnico-2"] },
    { ruta: "agentes/postventa/casos/", responsables: ["resp-booking", "booking-2"] },
  ]),
);

const CASO = "agentes/postventa/casos/cambios/cambiar-fechas/SKILL.md";
const ACCION = "acciones/reenviar-bono.md";
const ahora = new Date("2026-10-22T10:00:00Z");

const nueva = (autor: Usuario, ficheros = [CASO]) =>
  Propuesta.nueva({
    id: 7,
    titulo: "Cambiar fechas en Portugal",
    descripcion: "",
    autor,
    origen: autor.esIA ? "mcp" : "visor",
    rama: "propuesta/7",
    base: "abc123",
    ficheros,
    creadaEn: ahora,
  });

describe("Propuesta", () => {
  it("nace abierta, sin probar y sin aprobaciones", () => {
    const propuesta = nueva(booking1);
    expect(propuesta.estado).toBe("abierta");
    expect(propuesta.probadaPor).toBeUndefined();
    expect(propuesta.aprobaciones).toEqual([]);
  });

  describe("probarla", () => {
    it("la marca como probada quien la hizo", () => {
      const propuesta = nueva(booking1);
      propuesta.marcarProbada(booking1, ahora);
      expect(propuesta.probadaPor).toBe("booking-1");
    });

    it("otra persona no puede marcar como probada una propuesta ajena", () => {
      expect(() => nueva(booking1).marcarProbada(booking2, ahora)).toThrow(ErrorDeCircuito);
    });

    it("una propuesta de la IA la prueba una persona, nunca la IA", () => {
      const propuesta = nueva(ia);
      expect(() => propuesta.marcarProbada(ia, ahora)).toThrow(/una persona/);
      propuesta.marcarProbada(booking1, ahora);
      expect(propuesta.probadaPor).toBe("booking-1");
    });
  });

  describe("aprobarla", () => {
    it("la aprueba un responsable de lo que toca", () => {
      const propuesta = nueva(booking1);
      propuesta.aprobar(booking2, responsables, ahora);
      expect(propuesta.aprobaciones).toEqual([{ usuario: "booking-2", en: ahora.toISOString() }]);
    });

    it("nadie aprueba su propia propuesta", () => {
      expect(() => nueva(booking2).aprobar(booking2, responsables, ahora)).toThrow(/propia/);
    });

    it("la IA no aprueba", () => {
      expect(() => nueva(booking1).aprobar(ia, responsables, ahora)).toThrow(/una persona/);
    });

    it("quien no es responsable de nada de lo que toca no aprueba", () => {
      expect(() => nueva(booking2, [ACCION]).aprobar(respBooking, responsables, ahora)).toThrow(/responsable/);
    });

    it("no se aprueba dos veces", () => {
      const propuesta = nueva(booking1);
      propuesta.aprobar(booking2, responsables, ahora);
      expect(() => propuesta.aprobar(booking2, responsables, ahora)).toThrow(/ya la aprobó/);
    });
  });

  describe("qué falta para publicar", () => {
    it("lo enumera todo en una propuesta recién hecha", () => {
      const pendientes = nueva(booking1, [CASO, ACCION]).pendientesParaPublicar([{ ruta: CASO, mensaje: "falta description" }], responsables);
      expect(pendientes).toEqual([
        "la validación de formato tiene 1 problema",
        "falta que quien hizo el cambio lo pruebe en Travis",
        `falta la aprobación de un responsable de ${ACCION} (tecnico-1, tecnico-2)`,
        `falta la aprobación de un responsable de ${CASO} (resp-booking, booking-2)`,
      ]);
    });

    it("no falta nada cuando está validada, probada y aprobada por cada fichero", () => {
      const propuesta = nueva(booking1, [CASO, ACCION]);
      propuesta.marcarProbada(booking1, ahora);
      propuesta.aprobar(booking2, responsables, ahora);
      propuesta.aprobar(tecnico1, responsables, ahora);
      expect(propuesta.pendientesParaPublicar([], responsables)).toEqual([]);
    });

    it("una aprobación de un fichero no cubre otro con otros responsables", () => {
      const propuesta = nueva(booking1, [CASO, ACCION]);
      propuesta.marcarProbada(booking1, ahora);
      propuesta.aprobar(booking2, responsables, ahora);
      expect(propuesta.pendientesParaPublicar([], responsables)).toEqual([
        `falta la aprobación de un responsable de ${ACCION} (tecnico-1, tecnico-2)`,
      ]);
    });
  });

  describe("publicarla", () => {
    const lista = () => {
      const propuesta = nueva(booking1);
      propuesta.marcarProbada(booking1, ahora);
      propuesta.aprobar(booking2, responsables, ahora);
      return propuesta;
    };

    it("pasa a publicada con su número de versión", () => {
      const propuesta = lista();
      propuesta.publicar(respBooking, 4, [], responsables, ahora);
      expect(propuesta.estado).toBe("publicada");
      expect(propuesta.version).toBe(4);
      expect(propuesta.publicadaPor).toBe("resp-booking");
    });

    it("no se publica si falta algo, y dice qué", () => {
      expect(() => nueva(booking1).publicar(respBooking, 4, [], responsables, ahora)).toThrow(/pruebe en Travis/);
    });

    it("la IA no publica", () => {
      expect(() => lista().publicar(ia, 4, [], responsables, ahora)).toThrow(/una persona/);
    });

    it("una publicada ya no se aprueba, ni se rechaza, ni se vuelve a publicar", () => {
      const propuesta = lista();
      propuesta.publicar(respBooking, 4, [], responsables, ahora);
      expect(() => propuesta.aprobar(respBooking, responsables, ahora)).toThrow(/publicada/);
      expect(() => propuesta.rechazar(respBooking, "no", responsables, ahora)).toThrow(/publicada/);
      expect(() => propuesta.publicar(respBooking, 5, [], responsables, ahora)).toThrow(/publicada/);
    });
  });

  describe("rechazarla", () => {
    it("la rechaza un responsable con un motivo", () => {
      const propuesta = nueva(booking1);
      propuesta.rechazar(booking2, "Duplica el caso de cambiar fechas", responsables, ahora);
      expect(propuesta.estado).toBe("rechazada");
      expect(propuesta.rechazo).toEqual({ usuario: "booking-2", motivo: "Duplica el caso de cambiar fechas", en: ahora.toISOString() });
    });

    it("quien la hizo puede retirarla", () => {
      const propuesta = nueva(booking1);
      propuesta.rechazar(booking1, "Me equivoqué", responsables, ahora);
      expect(propuesta.estado).toBe("rechazada");
    });

    it("sin motivo no se rechaza", () => {
      expect(() => nueva(booking1).rechazar(booking2, "  ", responsables, ahora)).toThrow(/motivo/);
    });

    it("quien no es responsable ni autor no la rechaza", () => {
      expect(() => nueva(booking1, [ACCION]).rechazar(booking2, "no", responsables, ahora)).toThrow(/responsable/);
    });
  });

  it("se guarda y se recupera tal cual", () => {
    const propuesta = nueva(booking1);
    propuesta.marcarProbada(booking1, ahora);
    expect(Propuesta.desdeDatos(JSON.parse(JSON.stringify(propuesta.datos()))).datos()).toEqual(propuesta.datos());
  });
});
