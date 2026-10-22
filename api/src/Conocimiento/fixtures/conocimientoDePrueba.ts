import { stringify } from "yaml";

export const md = (cabecera: unknown, cuerpo = "") => `---\n${stringify(cabecera)}---\n${cuerpo}`;

export const RUTAS = {
  agente: "agentes/postventa/AGENTE.md",
  area: "agentes/postventa/casos/cambios/AREA.md",
  caso: "agentes/postventa/casos/cambios/cambiar-fechas/SKILL.md",
  pruebas: "agentes/postventa/casos/cambios/cambiar-fechas/pruebas.md",
  informacion: "informacion/comun/cambios-de-reserva.md",
  plantilla: "plantillas/reserva-nueva.md",
  aviso: "avisos/lluvias.md",
  avisoCaducado: "avisos/cierre.md",
  accion: "acciones/crear-ticket-booking.md",
  responsables: "responsables.yml",
};

export const SECCIONES = ["Cuándo aplica", "Qué hace el agente", "Qué no hace", "Cuándo pasa a una persona", "Cómo lo puede pedir el cliente"];

export const cuerpoDeCaso = (extra = "") =>
  SECCIONES.map((seccion) => `## ${seccion}\n\n- texto\n`).join("\n") +
  "\nUsa `verificar-identidad`, `crear-ticket-booking`, `comun/cambios-de-reserva` y `reserva-nueva`.\n" +
  extra;

export const cabeceraDeCaso = () => ({
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

export const informacion = (pregunta = "¿Se puede cambiar?") =>
  md({ name: "cambios-de-reserva", titulo: "Cambios de reserva", description: "Cómo funcionan los cambios" }, `## ${pregunta}\n\nSí, lo gestiona booking.\n`);

export function conocimientoDePrueba(): Map<string, string> {
  return new Map([
    ["FORMATO.md", "# Formato\n"],
    [
      RUTAS.responsables,
      stringify([
        { ruta: "*", responsables: ["tecnico-1", "tecnico-2"] },
        { ruta: "agentes/postventa/casos/", responsables: ["resp-booking", "booking-2"] },
        { ruta: "informacion/", responsables: ["resp-booking", "booking-2"] },
        { ruta: "plantillas/", responsables: ["resp-booking", "booking-2"] },
        { ruta: "avisos/", responsables: ["resp-booking", "booking-2"] },
      ]),
    ],
    [RUTAS.agente, md({ name: "postventa", description: "Reglas" }, "## Tono\n\n- Cercano\n")],
    [RUTAS.area, md({ name: "cambios", titulo: "Cambios en la reserva", description: "Cambiar fechas o servicios" })],
    [RUTAS.caso, md(cabeceraDeCaso(), cuerpoDeCaso())],
    [RUTAS.pruebas, md({ caso: "cambiar-fechas", pruebas: [{ pregunta: "¿Puedo cambiar las fechas?", esperado: "Lo pasa a booking" }] })],
    ["acciones/verificar-identidad.md", md({ name: "verificar-identidad", description: "Comprueba que es el titular" })],
    [RUTAS.accion, md({ name: "crear-ticket-booking", description: "Crea un ticket para booking" })],
    [RUTAS.informacion, informacion()],
    [RUTAS.plantilla, md({ name: "reserva-nueva", titulo: "Reserva nueva", description: "Para pt", mercados: ["pt"] }, "Hola.\n")],
    [RUTAS.aviso, md({ name: "lluvias", titulo: "Lluvias en la costa", desde: "2026-10-20", hasta: "2026-10-26", areas: ["cambios"] }, "- Avisa\n")],
    [RUTAS.avisoCaducado, md({ name: "cierre", titulo: "Atracción cerrada", desde: "2026-10-01", hasta: "2026-10-15" }, "- Avisa\n")],
  ]);
}
