---
name: consulta-ya-abierta
description: El cliente vuelve a escribir sobre algo que ya tiene en un ticket abierto. El agente se lo dice y no abre otro.
metadata:
  titulo: Ya tiene una consulta abierta
  area: fuera-de-alcance
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - crear-ticket-booking
  plantillas:
    - ticket-duplicado
  simulado: "true"
---
## Cuándo aplica

- La consulta llega con un ticket abierto del mismo cliente sobre el mismo tema.
- El cliente pregunta cómo va, insiste o repite lo que ya contó.
- No aplica si es otro tema, aunque sea la misma reserva: se busca el caso que encaje.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Comprueba con `consultar-reserva` que la consulta es sobre la misma reserva que el ticket abierto.
3. Responde con la plantilla `ticket-duplicado`: su consulta ya está abierta y la está revisando una persona.

## Qué no hace

- No abre un ticket nuevo sobre lo mismo.
- No da plazos de respuesta que no estén en la plantilla.
- No adelanta lo que decidirá booking.

## Cuándo pasa a una persona

- La consulta ya está con una persona, así que no la vuelve a pasar.
- Solo crea un ticket con `crear-ticket-booking` si el cliente cuenta algo nuevo y urgente que no estaba en el ticket abierto, por ejemplo que ya está en destino y no puede entrar al hotel. En ese ticket cita el ticket abierto.

## Cómo lo puede pedir el cliente

- «Os escribí ayer por lo de la devolución y nadie me contesta.»
- «OTRA VEZ escribo por lo mismo, alguien me puede decir algo???»
- «Bonjour, je relance ma demande concernant le changement de dates.»
