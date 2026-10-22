import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Response } from "express";
import { NoEncontrado, PeticionNoValida } from "../application/Errores";
import { ErrorDeAlmacen } from "../domain/AlmacenConocimiento";
import { ErrorDeCircuito } from "../domain/Propuesta";

@Catch()
export class FiltroDeErrores implements ExceptionFilter {
  private readonly registro = new Logger(FiltroDeErrores.name);

  catch(error: unknown, host: ArgumentsHost) {
    const respuesta = host.switchToHttp().getResponse<Response>();
    const mensaje = error instanceof Error ? error.message : String(error);
    if (error instanceof HttpException) {
      respuesta.status(error.getStatus()).json({ mensaje });
      return;
    }
    const estado =
      error instanceof PeticionNoValida ? 400 : error instanceof NoEncontrado ? 404 : error instanceof ErrorDeCircuito || error instanceof ErrorDeAlmacen ? 409 : 500;
    if (estado === 500) this.registro.error(error instanceof Error ? error.stack : mensaje);
    respuesta.status(estado).json({ mensaje });
  }
}
