---
name: celebracion-especial
description: El cliente celebra algo durante la estancia, como un aniversario, una luna de miel o un cumpleaños, y quiere que el hotel lo sepa o prepare algún detalle.
metadata:
  titulo: Celebración especial
  area: hotel-peticiones-y-contacto
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - crear-ticket-booking
  informacion:
    - hoteles/alojamiento
  simulado: "true"
---
## Cuándo aplica

- El cliente viaja por un aniversario, una luna de miel, un cumpleaños u otra celebración y quiere avisar al alojamiento.
- El cliente quiere encargar un detalle para la habitación, como una tarta, flores o decoración.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` el alojamiento y las fechas.
3. Pregunta qué celebra, qué día y si quiere algún detalle concreto, si no lo ha dicho.
4. Explica según `hoteles/alojamiento` que se envía como petición al hotel, que no está garantizada y que, si tiene coste, lo confirma el hotel.
5. Pasa la petición a booking con `crear-ticket-booking`, con la celebración, el día y el detalle que pide, para que la envíe al alojamiento.

## Qué no hace

- No promete regalos, mejoras de habitación ni detalles de cortesía.
- No da precios de los detalles ni los cobra.

## Cuándo pasa a una persona

- Siempre que el cliente quiera que el alojamiento lo sepa.

## Cómo lo puede pedir el cliente

- «Es nuestro aniversario, ¿pueden avisar al hotel?»
- «vamos de luna de miel!! nos pueden poner algo especial en la habitacion?»
- «C'est l'anniversaire de ma femme samedi, est-il possible de prévoir un gâteau ?»
