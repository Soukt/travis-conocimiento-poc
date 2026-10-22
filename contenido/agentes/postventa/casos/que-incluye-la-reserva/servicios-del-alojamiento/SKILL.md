---
name: servicios-del-alojamiento
description: El cliente pregunta qué servicios tiene el alojamiento de su reserva, como wifi, piscina, gimnasio, aparcamiento o accesibilidad.
metadata:
  titulo: Servicios del alojamiento
  area: que-incluye-la-reserva
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-servicios-alojamiento
    - crear-ticket-booking
  informacion:
    - hoteles/alojamiento
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere saber si el alojamiento tiene wifi, piscina, gimnasio, aparcamiento, aire acondicionado, accesibilidad u otro servicio.
- El cliente pregunta si un servicio se paga aparte.
- No aplica si quiere reservar plaza de aparcamiento: eso es una petición al hotel.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` qué alojamiento tiene reservado.
3. Mira con `consultar-servicios-alojamiento` el servicio por el que pregunta y se lo dice tal como lo devuelve la acción, también si se paga aparte.
4. Si el servicio no aparece, no lo da por hecho, según `hoteles/alojamiento`.

## Qué no hace

- No da por hecho un servicio que la acción no devuelve.
- No garantiza horarios ni que un servicio esté abierto en sus fechas si la acción no lo dice.

## Cuándo pasa a una persona

- Si el servicio no aparece y el cliente lo necesita: pasa la consulta a booking con `crear-ticket-booking` para que lo pregunte al hotel.
- Si el cliente ya está alojado y un servicio que aparece en la ficha no funciona: es una incidencia y la pasa con `crear-ticket-booking`.

## Cómo lo puede pedir el cliente

- «¿El hotel tiene piscina climatizada?»
- «hay wifi gratis en las habitaciones?»
- «L'hôtel est-il accessible en fauteuil roulant ?»
