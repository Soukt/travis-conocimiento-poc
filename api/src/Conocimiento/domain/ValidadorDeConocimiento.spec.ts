import { stringify } from "yaml";
import { validarConocimiento } from "./ValidadorDeConocimiento";

const md = (cabecera: unknown, cuerpo = "") => `---\n${stringify(cabecera)}---\n${cuerpo}`;

const AGENTE = "agentes/postventa/AGENTE.md";
const AREA = "agentes/postventa/casos/cambios/AREA.md";
const CASO = "agentes/postventa/casos/cambios/cambiar-fechas/SKILL.md";
const PRUEBAS = "agentes/postventa/casos/cambios/cambiar-fechas/pruebas.md";
const INFO = "informacion/comun/cambios-de-reserva.md";
const PLANTILLA = "plantillas/reserva-nueva.md";
const AVISO = "avisos/lluvias.md";
const RESPONSABLES = "responsables.yml";

const SECCIONES = ["Cuándo aplica", "Qué hace el agente", "Qué no hace", "Cuándo pasa a una persona", "Cómo lo puede pedir el cliente"];

const cabeceraCaso = () => ({
  name: "cambiar-fechas",
  description: "Mover las fechas de una reserva.",
  metadata: {
    area: "cambios",
    modo: "copiloto",
    acciones: ["verificar-identidad", "crear-ticket-booking"],
    informacion: ["comun/cambios-de-reserva"],
    plantillas: ["reserva-nueva"],
    simulado: "true",
  },
});

const cuerpoCaso = (extra = "") =>
  SECCIONES.map((seccion) => `## ${seccion}\n\n- texto\n`).join("\n") +
  "\nUsa `verificar-identidad`, `crear-ticket-booking`, `comun/cambios-de-reserva` y `reserva-nueva`.\n" +
  extra;

function arbolValido(): Map<string, string> {
  return new Map([
    ["FORMATO.md", "# Formato\n"],
    [RESPONSABLES, stringify([{ ruta: "*", responsables: ["tecnico-1"] }])],
    [AGENTE, md({ name: "postventa", description: "Reglas" }, "## Tono\n")],
    [AREA, md({ name: "cambios", titulo: "Cambios", description: "Cambios en la reserva" })],
    [CASO, md(cabeceraCaso(), cuerpoCaso())],
    [PRUEBAS, md({ caso: "cambiar-fechas", pruebas: [{ pregunta: "¿Puedo?", reserva: "reembolsable", mercado: "pt", esperado: "Sí" }] })],
    ["acciones/verificar-identidad.md", md({ name: "verificar-identidad", description: "Comprueba" })],
    ["acciones/crear-ticket-booking.md", md({ name: "crear-ticket-booking", description: "Crea ticket" })],
    [INFO, md({ name: "cambios-de-reserva", titulo: "Cambios", description: "Cómo funcionan" }, "## ¿Se puede?\n\nSí.\n")],
    [PLANTILLA, md({ name: "reserva-nueva", titulo: "Reserva nueva", description: "Para pt", mercados: ["pt"] }, "Hola.\n")],
    [AVISO, md({ name: "lluvias", titulo: "Lluvias", desde: "2026-10-20", hasta: "2026-10-26", areas: ["cambios"], mercados: ["es"] }, "- Avisa\n")],
  ]);
}

const conCambio = (ruta: string, contenido: string | null) => {
  const arbol = arbolValido();
  if (contenido === null) arbol.delete(ruta);
  else arbol.set(ruta, contenido);
  return arbol;
};

const mensajesDe = (arbol: Map<string, string>, ruta: string) =>
  validarConocimiento(arbol)
    .filter((problema) => problema.ruta === ruta)
    .map((problema) => problema.mensaje);

describe("validarConocimiento", () => {
  it("un árbol que cumple el formato no tiene problemas", () => {
    expect(validarConocimiento(arbolValido())).toEqual([]);
  });

  it("una ruta que no encaja en la estructura es un problema", () => {
    expect(mensajesDe(conCambio("notas/idea.md", "x"), "notas/idea.md")).toEqual([expect.stringMatching(/no encaja en la estructura/)]);
  });

  it("una cabecera que no es YAML válido se informa sin romper la validación", () => {
    expect(mensajesDe(conCambio(INFO, "---\nname: [roto\n---\n## ¿x?\n"), INFO)).toEqual([expect.stringMatching(/YAML válido/)]);
  });

  describe("nombres", () => {
    it.each([
      ["no coincide con la carpeta", "otro-nombre", /no coincide con «cambiar-fechas»/],
      ["tiene mayúsculas", "Cambiar-Fechas", /minúsculas/],
      ["tiene guiones dobles", "cambiar--fechas", /minúsculas/],
      ["es demasiado largo", "a".repeat(65), /64/],
    ])("un caso cuyo name %s", (_motivo, nombre, mensaje) => {
      const arbol = conCambio(CASO, md({ ...cabeceraCaso(), name: nombre }, cuerpoCaso()));
      expect(mensajesDe(arbol, CASO)).toContainEqual(expect.stringMatching(mensaje));
    });

    it("dos casos con el mismo name en áreas distintas", () => {
      const arbol = arbolValido();
      const otraArea = "agentes/postventa/casos/otra/AREA.md";
      const otroCaso = "agentes/postventa/casos/otra/cambiar-fechas/SKILL.md";
      arbol.set(otraArea, md({ name: "otra", titulo: "Otra", description: "Otra" }));
      arbol.set(otroCaso, md({ ...cabeceraCaso(), metadata: { ...cabeceraCaso().metadata, area: "otra" } }, cuerpoCaso()));
      arbol.set("agentes/postventa/casos/otra/cambiar-fechas/pruebas.md", arbol.get(PRUEBAS)!);

      expect(mensajesDe(arbol, otroCaso)).toContainEqual(expect.stringMatching(/repetido.*cambios\/cambiar-fechas/));
    });
  });

  describe("caso", () => {
    const conCabecera = (cambios: Record<string, unknown>, cuerpo = cuerpoCaso()) =>
      conCambio(CASO, md({ ...cabeceraCaso(), ...cambios }, cuerpo));
    const conMetadata = (cambios: Record<string, unknown>, cuerpo = cuerpoCaso()) =>
      conCabecera({ metadata: { ...cabeceraCaso().metadata, ...cambios } }, cuerpo);

    it("sin cabecera", () => {
      expect(mensajesDe(conCambio(CASO, cuerpoCaso()), CASO)).toContainEqual(expect.stringMatching(/falta la cabecera/));
    });

    it("sin description o demasiado larga", () => {
      expect(mensajesDe(conCabecera({ description: "" }), CASO)).toContainEqual(expect.stringMatching(/description/));
      expect(mensajesDe(conCabecera({ description: "x".repeat(1025) }), CASO)).toContainEqual(expect.stringMatching(/1024/));
    });

    it("con un campo de cabecera que no admite el estándar", () => {
      expect(mensajesDe(conCabecera({ area: "cambios" }), CASO)).toContainEqual(expect.stringMatching(/campo de cabecera no permitido: area/));
    });

    it("con metadata.area distinta de su carpeta", () => {
      expect(mensajesDe(conMetadata({ area: "pagos" }), CASO)).toContainEqual(expect.stringMatching(/metadata.area.*cambios/));
    });

    it("con un título para personas que no es texto", () => {
      expect(mensajesDe(conMetadata({ titulo: ["Cambiar", "fechas"] }), CASO)).toContainEqual(expect.stringMatching(/metadata.titulo tiene que ser texto/));
      expect(mensajesDe(conMetadata({ titulo: "Cambiar las fechas" }), CASO)).toEqual([]);
    });

    it("con un modo que no existe", () => {
      expect(mensajesDe(conMetadata({ modo: "magia" }), CASO)).toContainEqual(expect.stringMatching(/metadata.modo/));
    });

    it("declara una acción, información o plantilla que no existe", () => {
      expect(mensajesDe(conMetadata({ acciones: ["verificar-identidad", "crear-ticket-booking", "volar"] }), CASO)).toContainEqual(
        expect.stringMatching(/acción.*volar.*no existe/),
      );
      expect(mensajesDe(conMetadata({ informacion: ["comun/cambios-de-reserva", "comun/nada"] }), CASO)).toContainEqual(
        expect.stringMatching(/información.*comun\/nada.*no existe/),
      );
      expect(mensajesDe(conMetadata({ plantillas: ["reserva-nueva", "nada"] }), CASO)).toContainEqual(
        expect.stringMatching(/plantilla.*nada.*no existe/),
      );
    });

    it("cita en el texto algo que no declara en la cabecera", () => {
      const cuerpo = cuerpoCaso("Y luego `reenviar-bono`.\n");
      expect(mensajesDe(conCabecera({}, cuerpo), CASO)).toContainEqual(expect.stringMatching(/cita `reenviar-bono`.*no lo declara/));
    });

    it("en modo persona tiene que usar crear-ticket-booking", () => {
      const cuerpo = cuerpoCaso().replace(", `crear-ticket-booking`", "");
      const arbol = conMetadata({ modo: "persona", acciones: ["verificar-identidad"] }, cuerpo);
      expect(mensajesDe(arbol, CASO)).toContainEqual(expect.stringMatching(/modo persona.*crear-ticket-booking/));
    });

    it("le falta una sección obligatoria", () => {
      const cuerpo = cuerpoCaso().replace("## Qué no hace", "## Otra cosa");
      expect(mensajesDe(conCabecera({}, cuerpo), CASO)).toContainEqual(expect.stringMatching(/falta la sección «Qué no hace»/));
    });

    it("está en un área sin AREA.md", () => {
      expect(mensajesDe(conCambio(AREA, null), CASO)).toContainEqual(expect.stringMatching(/área.*no tiene AREA.md/));
    });

    it("no lleva sus pruebas al lado", () => {
      expect(mensajesDe(conCambio(PRUEBAS, null), CASO)).toContainEqual(expect.stringMatching(/falta pruebas.md/));
    });
  });

  describe("pruebas", () => {
    const conPruebas = (cabecera: unknown) => conCambio(PRUEBAS, md(cabecera));

    it("con caso distinto de su carpeta", () => {
      expect(mensajesDe(conPruebas({ caso: "otro", pruebas: [{ pregunta: "a", esperado: "b" }] }), PRUEBAS)).toContainEqual(
        expect.stringMatching(/caso.*cambiar-fechas/),
      );
    });

    it("sin ninguna prueba", () => {
      expect(mensajesDe(conPruebas({ caso: "cambiar-fechas", pruebas: [] }), PRUEBAS)).toContainEqual(expect.stringMatching(/al menos una prueba/));
    });

    it("una prueba sin pregunta o sin respuesta esperada", () => {
      const mensajes = mensajesDe(conPruebas({ caso: "cambiar-fechas", pruebas: [{ pregunta: "a" }, { esperado: "b" }] }), PRUEBAS);
      expect(mensajes).toContainEqual(expect.stringMatching(/prueba 1.*esperado/));
      expect(mensajes).toContainEqual(expect.stringMatching(/prueba 2.*pregunta/));
    });

    it("con un mercado que no existe", () => {
      const arbol = conPruebas({ caso: "cambiar-fechas", pruebas: [{ pregunta: "a", esperado: "b", mercado: "de" }] });
      expect(mensajesDe(arbol, PRUEBAS)).toContainEqual(expect.stringMatching(/mercado.*de/));
    });

    it("sin su SKILL.md al lado", () => {
      expect(mensajesDe(conCambio(CASO, null), PRUEBAS)).toContainEqual(expect.stringMatching(/no hay SKILL.md/));
    });
  });

  describe("información, avisos, plantillas, acciones y áreas", () => {
    it("información sin ninguna pregunta", () => {
      const arbol = conCambio(INFO, md({ name: "cambios-de-reserva", titulo: "C", description: "D" }, "Solo texto.\n"));
      expect(mensajesDe(arbol, INFO)).toContainEqual(expect.stringMatching(/al menos una pregunta/));
    });

    it("información sin titulo", () => {
      expect(mensajesDe(conCambio(INFO, md({ name: "cambios-de-reserva", description: "D" }, "## ¿x?\n")), INFO)).toContainEqual(
        expect.stringMatching(/titulo/),
      );
    });

    it("aviso con fechas mal escritas o al revés", () => {
      const base = { name: "lluvias", titulo: "Lluvias" };
      expect(mensajesDe(conCambio(AVISO, md({ ...base, desde: "20/10/2026", hasta: "2026-10-26" })), AVISO)).toContainEqual(
        expect.stringMatching(/desde.*AAAA-MM-DD/),
      );
      expect(mensajesDe(conCambio(AVISO, md({ ...base, desde: "2026-10-26", hasta: "2026-10-20" })), AVISO)).toContainEqual(
        expect.stringMatching(/hasta.*anterior/),
      );
    });

    it("aviso que afecta a un área que no existe", () => {
      const arbol = conCambio(AVISO, md({ name: "lluvias", titulo: "L", desde: "2026-10-20", hasta: "2026-10-26", areas: ["nada"] }));
      expect(mensajesDe(arbol, AVISO)).toContainEqual(expect.stringMatching(/área.*nada.*no existe/));
    });

    it("plantilla con un mercado que no existe", () => {
      const arbol = conCambio(PLANTILLA, md({ name: "reserva-nueva", titulo: "R", description: "D", mercados: ["xx"] }));
      expect(mensajesDe(arbol, PLANTILLA)).toContainEqual(expect.stringMatching(/mercado.*xx/));
    });

    it("acción cuyo name no coincide con el fichero", () => {
      const ruta = "acciones/verificar-identidad.md";
      expect(mensajesDe(conCambio(ruta, md({ name: "verificar", description: "D" })), ruta)).toContainEqual(
        expect.stringMatching(/no coincide/),
      );
    });

    it("área sin titulo", () => {
      expect(mensajesDe(conCambio(AREA, md({ name: "cambios", description: "D" })), AREA)).toContainEqual(expect.stringMatching(/titulo/));
    });

    it("reglas del agente cuyo name no es la carpeta", () => {
      expect(mensajesDe(conCambio(AGENTE, md({ name: "otro", description: "D" })), AGENTE)).toContainEqual(
        expect.stringMatching(/no coincide con «postventa»/),
      );
    });
  });

  describe("responsables", () => {
    const conResponsables = (reglas: unknown) => conCambio(RESPONSABLES, stringify(reglas));
    const usuarios = new Set(["tecnico-1", "booking-1"]);

    it("sin regla para «*»", () => {
      expect(mensajesDe(conResponsables([{ ruta: "acciones/", responsables: ["tecnico-1"] }]), RESPONSABLES)).toContainEqual(
        expect.stringMatching(/regla para «\*»/),
      );
    });

    it("una regla sin responsables", () => {
      const arbol = conResponsables([{ ruta: "*", responsables: [] }]);
      expect(mensajesDe(arbol, RESPONSABLES)).toContainEqual(expect.stringMatching(/sin responsables/));
    });

    it("un responsable que no es un usuario conocido", () => {
      const arbol = conResponsables([{ ruta: "*", responsables: ["tecnico-1", "fantasma"] }]);
      const problemas = validarConocimiento(arbol, { usuarios }).filter((p) => p.ruta === RESPONSABLES);
      expect(problemas.map((p) => p.mensaje)).toContainEqual(expect.stringMatching(/fantasma.*no es un usuario/));
    });

    it("un fichero que no es una lista de reglas", () => {
      expect(mensajesDe(conCambio(RESPONSABLES, "ruta: x\n"), RESPONSABLES)).toContainEqual(expect.stringMatching(/lista de reglas/));
    });
  });
});
