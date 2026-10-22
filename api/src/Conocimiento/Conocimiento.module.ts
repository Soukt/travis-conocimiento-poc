import { Module } from "@nestjs/common";
import { join } from "node:path";
import { CONFIGURACION } from "../configuracion";
import { ExplorarConocimiento } from "./application/ExplorarConocimiento";
import { ProponerCambio } from "./application/ProponerCambio";
import { RevisarPropuesta } from "./application/RevisarPropuesta";
import { ValidarBorrador } from "./application/ValidarBorrador";
import { VerHistorial } from "./application/VerHistorial";
import { DirectorioDeUsuarios } from "./domain/DirectorioDeUsuarios";
import { AlmacenGit } from "./infrastructure/AlmacenGit";
import { ConocimientoController } from "./infrastructure/ConocimientoController";
import { ConocimientoMcpController } from "./infrastructure/ConocimientoMcpController";
import { leerCarpeta } from "./infrastructure/leerCarpeta";
import { RepositorioPropuestasJson } from "./infrastructure/RepositorioPropuestasJson";
import { USUARIOS_DE_LA_PRUEBA } from "./infrastructure/usuariosDeLaPrueba";

const reloj = () => new Date();

@Module({
  controllers: [ConocimientoController, ConocimientoMcpController],
  providers: [
    {
      provide: AlmacenGit,
      useFactory: async () => {
        const almacen = new AlmacenGit(join(CONFIGURACION.carpetaDatos, "conocimiento.git"));
        await almacen.inicializar(await leerCarpeta(CONFIGURACION.carpetaContenido), { nombre: "carga-inicial", email: "carga-inicial@travis.local" });
        return almacen;
      },
    },
    { provide: RepositorioPropuestasJson, useFactory: () => new RepositorioPropuestasJson(join(CONFIGURACION.carpetaDatos, "propuestas.json")) },
    { provide: DirectorioDeUsuarios, useFactory: () => new DirectorioDeUsuarios(USUARIOS_DE_LA_PRUEBA) },
    { provide: ExplorarConocimiento, inject: [AlmacenGit], useFactory: (almacen: AlmacenGit) => new ExplorarConocimiento(almacen) },
    {
      provide: ProponerCambio,
      inject: [AlmacenGit, RepositorioPropuestasJson, DirectorioDeUsuarios],
      useFactory: (almacen: AlmacenGit, propuestas: RepositorioPropuestasJson, usuarios: DirectorioDeUsuarios) => new ProponerCambio(almacen, propuestas, usuarios, reloj),
    },
    {
      provide: RevisarPropuesta,
      inject: [AlmacenGit, RepositorioPropuestasJson, DirectorioDeUsuarios],
      useFactory: (almacen: AlmacenGit, propuestas: RepositorioPropuestasJson, usuarios: DirectorioDeUsuarios) => new RevisarPropuesta(almacen, propuestas, usuarios, reloj),
    },
    {
      provide: ValidarBorrador,
      inject: [AlmacenGit, DirectorioDeUsuarios],
      useFactory: (almacen: AlmacenGit, usuarios: DirectorioDeUsuarios) => new ValidarBorrador(almacen, usuarios),
    },
    {
      provide: VerHistorial,
      inject: [AlmacenGit, RepositorioPropuestasJson],
      useFactory: (almacen: AlmacenGit, propuestas: RepositorioPropuestasJson) => new VerHistorial(almacen, propuestas),
    },
  ],
})
export class ConocimientoModule {}
