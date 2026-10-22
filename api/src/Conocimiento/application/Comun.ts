import { AlmacenConocimiento } from "../domain/AlmacenConocimiento";
import { DirectorioDeUsuarios } from "../domain/DirectorioDeUsuarios";
import { Propuesta } from "../domain/Propuesta";
import { RepositorioPropuestas } from "../domain/RepositorioPropuestas";
import { Responsables } from "../domain/Responsables";
import { Usuario } from "../domain/Usuario";
import { Arbol, Problema, validarConocimiento } from "../domain/ValidadorDeConocimiento";
import { NoEncontrado, PeticionNoValida } from "./Errores";

export type Reloj = () => Date;

export async function responsablesPublicados(almacen: AlmacenConocimiento): Promise<Responsables> {
  return Responsables.desdeYaml((await almacen.leer("responsables.yml", "master")) ?? "");
}

// Solo cuenta lo que trae el cambio: un problema que ya estaba publicado no lo bloquea.
export function problemasQueAnade(antes: Arbol, despues: Arbol, usuarios: DirectorioDeUsuarios): Problema[] {
  const opciones = { usuarios: usuarios.ids() };
  const clave = (problema: Problema) => `${problema.ruta}\0${problema.mensaje}`;
  const previos = new Set(validarConocimiento(antes, opciones).map(clave));
  return validarConocimiento(despues, opciones).filter((problema) => !previos.has(clave(problema)));
}

export async function problemasNuevos(almacen: AlmacenConocimiento, propuesta: Propuesta, usuarios: DirectorioDeUsuarios): Promise<Problema[]> {
  const [antes, despues] = await Promise.all([almacen.leerArbol(propuesta.base), almacen.leerArbol(propuesta.rama)]);
  return problemasQueAnade(antes, despues, usuarios);
}

export function usuarioConocido(usuarios: DirectorioDeUsuarios, id: string): Usuario {
  const usuario = usuarios.buscar(id);
  if (!usuario) throw new PeticionNoValida(`usuario desconocido: ${id}`);
  return usuario;
}

export async function propuestaExistente(propuestas: RepositorioPropuestas, id: number): Promise<Propuesta> {
  const propuesta = await propuestas.buscar(id);
  if (!propuesta) throw new NoEncontrado(`no existe la propuesta ${id}`);
  return propuesta;
}
