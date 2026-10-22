import { Body, Controller, Get, Headers, HttpCode, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { hoy } from "../../configuracion";
import { PeticionNoValida } from "../application/Errores";
import { ExplorarConocimiento } from "../application/ExplorarConocimiento";
import { ProponerCambio } from "../application/ProponerCambio";
import { RevisarPropuesta } from "../application/RevisarPropuesta";
import { ValidarBorrador } from "../application/ValidarBorrador";
import { VerHistorial } from "../application/VerHistorial";
import { Cambio } from "../domain/AlmacenConocimiento";
import { DirectorioDeUsuarios } from "../domain/DirectorioDeUsuarios";

const quien = (usuario: string | undefined) => {
  if (!usuario) throw new PeticionNoValida("falta la cabecera x-usuario: elige quién eres en el visor");
  return usuario;
};

const numero = (valor: string | undefined, nombre: string) => {
  const leido = Number(valor);
  if (!Number.isInteger(leido) || leido < 1) throw new PeticionNoValida(`${nombre} tiene que ser un número de versión`);
  return leido;
};

@Controller("api")
export class ConocimientoController {
  constructor(
    private readonly explorar: ExplorarConocimiento,
    private readonly proponer: ProponerCambio,
    private readonly revisar: RevisarPropuesta,
    private readonly historialDeVersiones: VerHistorial,
    private readonly usuarios: DirectorioDeUsuarios,
    private readonly validarBorrador: ValidarBorrador,
  ) {}

  @Get("version")
  version() {
    return this.explorar.version();
  }

  @Get("usuarios")
  listaDeUsuarios() {
    return this.usuarios.todos();
  }

  @Get("piezas")
  piezas(@Query("ref") ref?: string) {
    return this.explorar.listado(ref || "master");
  }

  @Get("pieza")
  pieza(@Query("ruta") ruta: string, @Query("ref") ref?: string) {
    if (!ruta) throw new PeticionNoValida("falta la ruta");
    return this.explorar.pieza(ruta, ref || "master");
  }

  @Get("buscar")
  buscar(@Query("texto") texto = "") {
    return this.explorar.buscar(texto);
  }

  @Get("indice-de-areas")
  indiceDeAreas() {
    return this.explorar.indiceDeAreas();
  }

  @Get("avisos-vigentes")
  avisosVigentes(@Query("fecha") fecha?: string) {
    return this.explorar.avisosVigentes(fecha || hoy());
  }

  @Get("historial")
  historial(@Query("ruta") ruta?: string) {
    return this.historialDeVersiones.historial(ruta || undefined);
  }

  @Get("en-version")
  async enVersion(@Query("ruta") ruta: string, @Query("version") version: string) {
    return { contenido: await this.historialDeVersiones.enVersion(ruta, numero(version, "version")) };
  }

  @Get("diferencias")
  async diferencias(@Query("ruta") ruta: string, @Query("desde") desde: string, @Query("hasta") hasta: string) {
    return { diferencias: await this.historialDeVersiones.diferencias(ruta, numero(desde, "desde"), numero(hasta, "hasta")) };
  }

  @Post("validar")
  @HttpCode(200)
  async validar(@Body() cuerpo: { cambios: Cambio[] }) {
    return { problemas: await this.validarBorrador.ejecutar(cuerpo?.cambios) };
  }

  @Get("propuestas")
  propuestas() {
    return this.revisar.listar();
  }

  @Post("propuestas")
  crearPropuesta(@Headers("x-usuario") usuario: string | undefined, @Body() cuerpo: { titulo: string; descripcion?: string; cambios: Cambio[] }) {
    return this.proponer.ejecutar({ autor: quien(usuario), titulo: cuerpo?.titulo, descripcion: cuerpo?.descripcion, cambios: cuerpo?.cambios, origen: "visor" });
  }

  @Get("propuestas/:id")
  propuesta(@Param("id", ParseIntPipe) id: number) {
    return this.revisar.detalle(id);
  }

  @Post("propuestas/:id/probada")
  marcarProbada(@Param("id", ParseIntPipe) id: number, @Headers("x-usuario") usuario?: string) {
    return this.revisar.marcarProbada(id, quien(usuario));
  }

  @Post("propuestas/:id/aprobar")
  aprobar(@Param("id", ParseIntPipe) id: number, @Headers("x-usuario") usuario?: string) {
    return this.revisar.aprobar(id, quien(usuario));
  }

  @Post("propuestas/:id/rechazar")
  rechazar(@Param("id", ParseIntPipe) id: number, @Headers("x-usuario") usuario: string | undefined, @Body() cuerpo: { motivo?: string }) {
    return this.revisar.rechazar(id, quien(usuario), cuerpo?.motivo ?? "");
  }

  @Post("propuestas/:id/publicar")
  publicar(@Param("id", ParseIntPipe) id: number, @Headers("x-usuario") usuario?: string) {
    return this.revisar.publicar(id, quien(usuario));
  }
}
