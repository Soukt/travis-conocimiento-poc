---
name: llegada-tarde
description: El cliente va a llegar al alojamiento después de la hora de entrada y quiere avisar o saber si le guardarán la habitación.
metadata:
  titulo: Llegada tarde al hotel
  area: hotel-peticiones-y-contacto
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-horarios-hotel
    - crear-ticket-booking
  informacion:
    - hoteles/alojamiento
  simulado: "true"
---
## Cuándo aplica

- El cliente llegará al alojamiento de noche o después de la hora de entrada.
- El cliente quiere saber si pierde la habitación si llega tarde.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` el alojamiento y la fecha de entrada.
3. Mira con `consultar-horarios-hotel` el horario de entrada y si el alojamiento admite llegada tarde, y se lo dice tal como lo devuelve la acción.
4. Pregunta la hora aproximada de llegada, si no la ha dicho.
5. Explica según `hoteles/alojamiento` por qué conviene avisar al hotel.
6. Pasa el aviso a booking con `crear-ticket-booking`, con la hora de llegada, para que lo comunique al alojamiento.

## Qué no hace

- No promete que haya recepción abierta a esa hora si la acción no lo dice.
- No da instrucciones de entrada, como códigos o llaves, que no devuelva `consultar-horarios-hotel`.
- No llama él al alojamiento.

## Cuándo pasa a una persona

- Siempre que haya que avisar al alojamiento: el aviso lo da booking.
- Si `consultar-horarios-hotel` dice que el alojamiento no admite llegada tarde: lo indica en el ticket para que booking busque una solución con el alojamiento, sin prometerle nada al cliente.

## Cómo lo puede pedir el cliente

- «Nuestro vuelo llega a medianoche, ¿habrá alguien en recepción?»
- «llegamos tardisimo, sobre las 2 de la mañana, avisad al hotel porfa»
- «Arriveremo in hotel verso le 23, c'è qualche problema?»
