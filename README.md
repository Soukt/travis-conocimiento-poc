# Conocimiento de Travis: git propio, visor y MCP

**Prueba desechable.** Todo el contenido es simulado: casos, reservas, avisos y usuarios son inventados.

Esta prueba enseña cómo quedaría el conocimiento de Travis sin herramientas de terceros (ni Decap, ni GitBook, ni Notion):

- **Un git propio** guarda el conocimiento. Lo lleva un servicio NestJS: master es lo publicado, cada propuesta es una rama y cada publicación es una versión (`v1`, `v2`…).
- **Un visor** para quien no use el MCP, hecho con Next.js 14 y MUI 5 como fenix-next. Sirve para recorrer, buscar, editar, proponer, revisar, aprobar y publicar.
- **Un MCP** por el que una IA lee y propone cambios. Aprobar y publicar lo hace siempre una persona desde el visor.

Las propuestas de una persona y las de la IA siguen el mismo circuito: validación de formato, prueba de quien lo cambió, aprobación de un responsable de la carpeta y publicación.

## Arrancar

```bash
npm install
npm run dev
```

- Visor: http://localhost:3100
- API: http://localhost:3101/api
- MCP: http://localhost:3101/mcp

La primera vez, el servicio crea `data/conocimiento.git` a partir de `contenido/`. Para empezar de cero, borra `data/`.

## Probar el circuito

1. Arriba a la derecha, elige quién eres. No hay login: son usuarios inventados.
2. Abre un caso y pulsa **Editar**. Cambia algo y pulsa **Proponer cambio**. Lo publicado no cambia.
3. En la propuesta, pulsa **Lo he probado en Travis**: en esta prueba solo lo simula.
4. Cambia de usuario a un responsable de esa carpeta, pulsa **Aprobar** y luego **Publicar**. Sale la versión siguiente.
5. En **Versiones**, o en la pestaña Historial de la pieza, se ve qué cambió en cada versión, quién lo propuso y quién lo publicó. Desde ahí se puede proponer volver a una versión anterior.

Reglas del circuito:

- Nadie aprueba su propia propuesta.
- La IA no prueba, no aprueba y no publica.
- Cada fichero tocado necesita la aprobación de uno de sus responsables, según `contenido/responsables.yml`. Gana la regla más concreta.
- Cuentan los responsables publicados, no los que traiga la propuesta.
- Si master cambió desde que se hizo la propuesta, se fusiona. Si las dos tocan lo mismo, no se publica y lo dice.

| Usuario | Puede aprobar |
| --- | --- |
| Agente de booking 1 | Casos de parques y entradas |
| Agente de booking 2 | Casos, información, plantillas y avisos |
| Responsable de booking | Casos, información, plantillas, avisos y reglas del agente |
| Técnico 1 y Técnico 2 | Acciones, formato, responsables y lo demás |

## Conectar el MCP

Con Claude Code:

```bash
claude mcp add --transport http travis-conocimiento http://localhost:3101/mcp
```

Herramientas que ofrece:

- `ver_formato`
- `indice_de_areas`
- `avisos_vigentes`
- `listar_piezas`
- `buscar`
- `leer_pieza`
- `proponer_cambio`
- `ver_propuesta`

No tiene ninguna para aprobar ni publicar. Las propuestas de la IA salen en el visor marcadas como «Llegó por MCP».

## Cómo está hecho

```
contenido/       la semilla: FORMATO.md, responsables.yml, agentes/, informacion/, avisos/, plantillas/, acciones/
api/             NestJS 12
  src/Conocimiento/domain/          formato, validación, responsables y reglas de una propuesta (sin dependencias)
  src/Conocimiento/application/     proponer, revisar y publicar, explorar, historial, validar un borrador
  src/Conocimiento/infrastructure/  git, propuestas en JSON, API REST, MCP
visor/           Next.js 14.1 con MUI 5.14, con los mismos colores que fenix-next
data/            se crea al arrancar: conocimiento.git y propuestas.json (fuera de git)
```

- El git no tiene copia de trabajo. Cada propuesta se escribe con un índice temporal, así varias propuestas conviven sin pisarse.
- Publicar crea un commit de fusión firmado por quien publica y le pone la etiqueta de la versión.
- Para verlo por dentro: `git --git-dir data/conocimiento.git log --oneline --graph --all`.

El formato de cada pieza está en [`contenido/FORMATO.md`](contenido/FORMATO.md). Es el mismo fichero que lee la IA por el MCP.

## Comprobaciones

```bash
npm test          # lógica, git real en carpetas temporales y circuito de punta a punta
npm run validar   # que todo contenido/ cumpla el formato
```

## Lo que no hace

- **Login de verdad**: se elige quién eres en el visor.
- **Travis**: el agente no existe. «Lo he probado» solo simula la prueba y la batería automática sale como «no disponible». La bandeja dice qué pruebas se lanzarían.
- **Varios servidores a la vez**: las colas que evitan choques están dentro de un solo proceso.
- **Desplegarlo**: está pensado para arrancarlo en local.
