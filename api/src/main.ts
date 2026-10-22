import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { CONFIGURACION } from "./configuracion";
import { ConocimientoModule } from "./Conocimiento/Conocimiento.module";
import { FiltroDeErrores } from "./Conocimiento/infrastructure/FiltroDeErrores";

async function arrancar() {
  const app = await NestFactory.create<NestExpressApplication>(ConocimientoModule);
  app.useBodyParser("json", { limit: "5mb" });
  app.useGlobalFilters(new FiltroDeErrores());
  await app.listen(CONFIGURACION.puerto, "127.0.0.1");
  const registro = new Logger("Travis");
  registro.log(`API en http://localhost:${CONFIGURACION.puerto}/api · MCP en http://localhost:${CONFIGURACION.puerto}/mcp`);
  registro.log(`Conocimiento en ${CONFIGURACION.carpetaDatos}/conocimiento.git`);
}

void arrancar();
