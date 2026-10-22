# Formato del conocimiento de Travis

Todo el contenido de esta prueba es **simulado**: casos, reservas, avisos y precios son inventados.

Este fichero dice dónde va cada cosa y qué forma tiene. Lo leen las personas que editan, el MCP y cualquier IA que proponga cambios. Una propuesta que no cumple el formato no se puede publicar.

## Carpetas

```
agentes/
  postventa/
    AGENTE.md                     reglas del agente
    casos/
      <área>/
        AREA.md                   qué cubre el área (lo que ve el agente en el índice)
        <caso>/
          SKILL.md                qué hacer en esa situación
          pruebas.md              conversaciones de prueba con la respuesta esperada
informacion/<grupo>/<tema>.md     preguntas y respuestas aprobadas
avisos/<aviso>.md                 imprevistos vigentes, cada uno con fecha de fin
plantillas/<plantilla>.md         respuestas tipo
acciones/<acción>.md              catálogo de lo que el agente puede hacer en nuestros sistemas
responsables.yml                  quién aprueba los cambios de cada carpeta
FORMATO.md                        este fichero
```

## Reglas

1. **Cada cosa en un solo sitio.** Una política se escribe una vez en `informacion/` y los casos la citan.
2. **Los datos de la reserva nunca van en texto.** La hora de entrada o el calendario de gastos los da una acción; el caso solo dice cuál usar.
3. **Cada caso lleva sus pruebas al lado**, en `pruebas.md`.
4. **Se escribe una vez, en español.** El agente contesta en el idioma del cliente. Lo que cambia por mercado va en un apartado `## Diferencias por mercado` dentro del mismo fichero. Mercados: `es`, `pt`, `it`, `fr`.
5. **Todo lo que el texto cita entre comillas invertidas** (`` `consultar-reserva` ``, `` `comun/cambios-de-reserva` ``) tiene que estar declarado en la cabecera.
6. Las listas se escriben con `-`.

## Nombres

`name` va en minúsculas, con números y guiones sueltos, entre 1 y 64 caracteres, y es igual que su carpeta (casos, áreas, agentes) o que su fichero sin `.md` (el resto). Los nombres de los casos no se repiten entre áreas.

## Cada pieza

### Reglas del agente: `agentes/<agente>/AGENTE.md`

Cabecera: `name` (igual que la carpeta del agente) y `description`. El cuerpo es libre.

### Área: `agentes/<agente>/casos/<área>/AREA.md`

Cabecera: `name` (igual que la carpeta), `titulo` y `description` (qué cubre, en una o dos frases). El índice de áreas se genera solo a partir de estos ficheros. Un caso solo puede estar en un área que tenga su `AREA.md`.

### Caso: `agentes/<agente>/casos/<área>/<caso>/SKILL.md`

```markdown
---
name: cambiar-fechas
description: El cliente quiere mover las fechas de una reserva que aún no ha empezado.
metadata:
  titulo: Cambiar las fechas
  area: cambios-en-la-reserva
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
  informacion:
    - comun/cambios-de-reserva
  plantillas:
    - cambio-fechas-reserva-nueva
  simulado: "true"
---
## Cuándo aplica
## Qué hace el agente
## Qué no hace
## Cuándo pasa a una persona
## Cómo lo puede pedir el cliente
## Diferencias por mercado        (solo si las hay)
```

- `description`: obligatoria, como mucho 1024 caracteres.
- `metadata.titulo`: opcional, el título para personas, con tildes. El agente se guía por `name` y `description`.
- `metadata.area`: igual que la carpeta del área.
- `metadata.modo`: `autonomo` (responde solo), `copiloto` (lo revisa booking antes de enviarlo) o `persona` (lo pasa a booking).
- `metadata.acciones`: las acciones que usa; tienen que existir en `acciones/`. Un caso en modo `persona` usa siempre `crear-ticket-booking`.
- `metadata.informacion` y `metadata.plantillas`: opcionales; lo que cita, y tiene que existir.
- Las cinco primeras secciones son obligatorias.

### Pruebas: `agentes/<agente>/casos/<área>/<caso>/pruebas.md`

```markdown
---
caso: cambiar-fechas
pruebas:
  - pregunta: ¿Puedo pasar mi reserva del hotel a la semana siguiente?
    reserva: reembolsable, entrada dentro de 30 días
    mercado: es
    esperado: Explica que el cambio lo gestiona booking, no confirma precio ni disponibilidad y crea el ticket con las fechas nuevas.
---
```

- `caso`: igual que la carpeta del caso.
- Al menos una prueba. Cada una con `pregunta` y `esperado`; `reserva` (la reserva de prueba, descrita) y `mercado` son opcionales.

### Información: `informacion/<grupo>/<tema>.md`

Cabecera: `name` (igual que el fichero), `titulo` y `description`. Cuerpo: una pregunta por apartado `## ¿…?` con su respuesta debajo. Al menos una pregunta.

### Aviso: `avisos/<aviso>.md`

Cabecera: `name`, `titulo`, `desde` y `hasta` (fechas `AAAA-MM-DD`; `hasta` no puede ser anterior a `desde`), y opcionalmente `areas` (lista de áreas a las que afecta) y `mercados`. El agente solo lee los avisos vigentes. Cuerpo: qué tiene que decir o hacer el agente mientras dure.

### Plantilla: `plantillas/<plantilla>.md`

Cabecera: `name`, `titulo`, `description` y opcionalmente `mercados`. Cuerpo: el texto de la respuesta, en español.

### Acción: `acciones/<acción>.md`

Cabecera: `name` y `description`. Las acciones son código: aquí solo se describe qué devuelven.

### Responsables: `responsables.yml`

Lista de reglas `ruta` + `responsables`. Una `ruta` que acaba en `/` vale para toda la carpeta; `*` vale para todo. Gana la regla más concreta. Para publicar, cada fichero tocado necesita la aprobación de uno de sus responsables, y nadie aprueba su propia propuesta.
