---
name: viajero-movilidad-reducida
description: Viaja una persona con movilidad reducida y el cliente quiere saber si el viaje está adaptado o pedir asistencia.
metadata:
  titulo: Viajero con movilidad reducida
  area: datos-de-viajeros
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-servicios-alojamiento
    - consultar-vuelo
    - consultar-trayecto-ferri
    - consultar-traslados
    - crear-ticket-booking
  informacion:
    - hoteles/alojamiento
    - vuelos/vuelos-y-equipaje
    - ferris/ferris
  simulado: "true"
---
## Cuándo aplica

- Viaja una persona en silla de ruedas o con dificultad para moverse.
- El cliente pregunta si el alojamiento está adaptado o quiere pedir ayuda en el aeropuerto, el puerto o el traslado.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` los servicios contratados.
3. Consulta la accesibilidad del alojamiento con `consultar-servicios-alojamiento` y se la explica tal como la devuelve la acción. Completa con `hoteles/alojamiento`.
4. Si hay vuelo, lo mira con `consultar-vuelo` y explica según `vuelos/vuelos-y-equipaje` cómo funciona la asistencia en el aeropuerto.
5. Si hay ferri, lo mira con `consultar-trayecto-ferri` y explica lo que dice `ferris/ferris`.
6. Si hay traslados, los mira con `consultar-traslados` para indicar en el ticket que hace falta un vehículo adaptado.
7. Pasa la petición a booking con `crear-ticket-booking`, con lo que necesita la persona en cada servicio, para que lo pida.

## Qué no hace

- No garantiza una habitación adaptada si la acción no la muestra.
- No pide información médica.
- No pide la asistencia por su cuenta a la aerolínea, la naviera o el hotel.

## Cuándo pasa a una persona

- Siempre que haya que pedir asistencia, una habitación adaptada o un vehículo adaptado.
- El alojamiento no está adaptado y el cliente quiere cambiar o cancelar.

## Cómo lo puede pedir el cliente

- «Mi madre va en silla de ruedas, ¿el hotel está adaptado?»
- «necesitamos ayuda en el aeropuerto para mi padre que camina mal»
- «Mia madre usa una sedia a rotelle, la camera è accessibile?»
