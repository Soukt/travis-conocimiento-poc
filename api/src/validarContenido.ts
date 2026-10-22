import { resolve } from "node:path";
import { DirectorioDeUsuarios } from "./Conocimiento/domain/DirectorioDeUsuarios";
import { tipoDePieza } from "./Conocimiento/domain/Pieza";
import { validarConocimiento } from "./Conocimiento/domain/ValidadorDeConocimiento";
import { leerCarpeta } from "./Conocimiento/infrastructure/leerCarpeta";
import { USUARIOS_DE_LA_PRUEBA } from "./Conocimiento/infrastructure/usuariosDeLaPrueba";

async function main() {
  const carpeta = resolve(process.argv[2] ?? "../contenido");
  const arbol = await leerCarpeta(carpeta);
  const problemas = validarConocimiento(arbol, { usuarios: new DirectorioDeUsuarios(USUARIOS_DE_LA_PRUEBA).ids() });

  const recuento = new Map<string, number>();
  for (const ruta of arbol.keys()) {
    const tipo = tipoDePieza(ruta)?.tipo ?? "desconocido";
    recuento.set(tipo, (recuento.get(tipo) ?? 0) + 1);
  }
  console.log(`${arbol.size} ficheros en ${carpeta}`);
  for (const [tipo, numero] of [...recuento].sort()) console.log(`  ${tipo}: ${numero}`);

  if (problemas.length > 0) {
    console.error(`\n${problemas.length} problemas:`);
    for (const problema of problemas) console.error(`  ${problema.ruta}: ${problema.mensaje}`);
    process.exit(1);
  }
  console.log("\nTodo cumple el formato.");
}

main();
