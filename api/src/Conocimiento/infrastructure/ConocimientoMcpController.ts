import { Controller, Delete, Get, HttpCode, Post, Req, Res } from "@nestjs/common";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Request, Response } from "express";
import { z } from "zod";
import { CONFIGURACION, hoy } from "../../configuracion";
import { ExplorarConocimiento } from "../application/ExplorarConocimiento";
import { ProponerCambio } from "../application/ProponerCambio";
import { RevisarPropuesta } from "../application/RevisarPropuesta";

const USUARIO_DEL_MCP = "ia";

const INSTRUCCIONES = [
  "Conocimiento del agente de atención al cliente Travis (prueba con contenido simulado).",
  "Antes de proponer nada, lee ver_formato: dice dónde va cada cosa y qué forma tiene.",
  "Puedes leer, buscar y proponer cambios. Aprobar y publicar lo hace siempre una persona desde el visor.",
].join(" ");

type Resultado = { content: Array<{ type: "text"; text: string }>; isError?: boolean };

const texto = (contenido: string): Resultado => ({ content: [{ type: "text", text: contenido }] });
const json = (valor: unknown) => texto(JSON.stringify(valor, null, 2));

async function seguro(trabajo: () => Promise<Resultado>): Promise<Resultado> {
  try {
    return await trabajo();
  } catch (error) {
    return { ...texto(error instanceof Error ? error.message : String(error)), isError: true };
  }
}

// Sin sesiones: cada petición monta su servidor, como en los módulos de janus-mcp-facade.
@Controller("mcp")
export class ConocimientoMcpController {
  constructor(
    private readonly explorar: ExplorarConocimiento,
    private readonly proponer: ProponerCambio,
    private readonly revisar: RevisarPropuesta,
  ) {}

  @Post()
  async atender(@Req() peticion: Request, @Res() respuesta: Response) {
    const servidor = this.crearServidor();
    const transporte = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    respuesta.on("close", () => {
      void transporte.close();
      void servidor.close();
    });
    await servidor.connect(transporte);
    await transporte.handleRequest(peticion, respuesta, peticion.body);
  }

  @Get()
  @Delete()
  @HttpCode(405)
  sinSesiones() {
    return { jsonrpc: "2.0", error: { code: -32000, message: "Este servidor MCP no usa sesiones: solo POST." }, id: null };
  }

  private crearServidor(): McpServer {
    const servidor = new McpServer({ name: "travis-conocimiento", version: "0.1.0" }, { instructions: INSTRUCCIONES });
    const soloLectura = { readOnlyHint: true, openWorldHint: false };

    servidor.registerTool(
      "ver_formato",
      { title: "Ver el formato", description: "Devuelve FORMATO.md: carpetas, reglas y forma de cada pieza. Léelo antes de proponer.", annotations: soloLectura },
      () => seguro(async () => texto((await this.explorar.pieza("FORMATO.md")).contenido)),
    );

    servidor.registerTool(
      "indice_de_areas",
      { title: "Índice de áreas", description: "Las áreas de casos de cada agente, con lo que cubren y cuántos casos tienen.", annotations: soloLectura },
      () => seguro(async () => json(await this.explorar.indiceDeAreas())),
    );

    servidor.registerTool(
      "avisos_vigentes",
      { title: "Avisos vigentes", description: "Los imprevistos que el agente tiene que tener en cuenta hoy.", annotations: soloLectura },
      () => seguro(async () => json(await this.explorar.avisosVigentes(hoy()))),
    );

    servidor.registerTool(
      "listar_piezas",
      {
        title: "Listar piezas",
        description: "Lista las piezas publicadas (ruta, tipo y título). Filtra por carpeta, por ejemplo «agentes/postventa/casos/pagos-y-facturas/».",
        inputSchema: { carpeta: z.string().optional().describe("Prefijo de ruta para filtrar") },
        annotations: soloLectura,
      },
      ({ carpeta }) =>
        seguro(async () => {
          const piezas = (await this.explorar.listado()).filter((pieza) => !carpeta || pieza.ruta.startsWith(carpeta));
          return json(piezas.map(({ ruta, tipo, titulo }) => ({ ruta, tipo, titulo })));
        }),
    );

    servidor.registerTool(
      "buscar",
      {
        title: "Buscar",
        description: "Busca un texto en todo lo publicado, sin importar tildes ni mayúsculas.",
        inputSchema: { texto: z.string().min(1) },
        annotations: soloLectura,
      },
      ({ texto: consulta }) => seguro(async () => json((await this.explorar.buscar(consulta)).map(({ ruta, titulo, fragmento }) => ({ ruta, titulo, fragmento })))),
    );

    servidor.registerTool(
      "leer_pieza",
      {
        title: "Leer una pieza",
        description: "Devuelve el contenido publicado de una pieza, con sus responsables y, si es un caso, sus pruebas.",
        inputSchema: { ruta: z.string().min(1) },
        annotations: soloLectura,
      },
      ({ ruta }) =>
        seguro(async () => {
          const pieza = await this.explorar.pieza(ruta);
          const pie = [`Responsables: ${pieza.responsables.join(", ")}`, pieza.rutaPruebas ? `Pruebas en: ${pieza.rutaPruebas}` : ""].filter(Boolean);
          return texto(`${pieza.contenido}\n\n---\n${pie.join("\n")}`);
        }),
    );

    servidor.registerTool(
      "proponer_cambio",
      {
        title: "Proponer un cambio",
        description:
          "Crea una propuesta con uno o varios ficheros (contenido completo; null para borrar). No publica nada: una persona la prueba, la aprueba y la publica desde el visor. Un caso nuevo va siempre con su pruebas.md.",
        inputSchema: {
          titulo: z.string().min(1).describe("Qué cambia, en una frase"),
          descripcion: z.string().optional().describe("Por qué: de qué ticket o situación sale"),
          cambios: z.array(z.object({ ruta: z.string().min(1), contenido: z.string().nullable() })).min(1),
        },
        annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
      },
      ({ titulo, descripcion, cambios }) =>
        seguro(async () => {
          const { propuesta, problemas } = await this.proponer.ejecutar({ autor: USUARIO_DEL_MCP, titulo, descripcion, cambios, origen: "mcp" });
          const lineas = [
            `Propuesta #${propuesta.id} creada en la rama ${propuesta.rama}.`,
            `Ficheros: ${propuesta.ficheros.join(", ")}`,
            problemas.length === 0
              ? "Formato: correcto."
              : `Formato: ${problemas.length} problemas que hay que corregir antes de publicar:\n${problemas.map((problema) => `- ${problema.ruta}: ${problema.mensaje}`).join("\n")}`,
            `Revisión: ${CONFIGURACION.urlVisor}/propuestas/${propuesta.id}`,
          ];
          return texto(lineas.join("\n"));
        }),
    );

    servidor.registerTool(
      "ver_propuesta",
      {
        title: "Ver una propuesta",
        description: "Estado de una propuesta: qué falta para publicarla, problemas de formato y diferencias.",
        inputSchema: { id: z.number().int().positive() },
        annotations: soloLectura,
      },
      ({ id }) =>
        seguro(async () => {
          const { propuesta, pendientes, problemas, ficheros } = await this.revisar.detalle(id);
          return json({
            id: propuesta.id,
            titulo: propuesta.titulo,
            estado: propuesta.estado,
            version: propuesta.version,
            pendientes,
            problemas,
            diferencias: ficheros.map(({ ruta, cambio, diferencias }) => ({ ruta, cambio, diferencias })),
          });
        }),
    );

    return servidor;
  }
}
