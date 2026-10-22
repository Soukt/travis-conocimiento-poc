---
name: cambio-horario-vuelo
description: La aerolínea ha cambiado el horario de un vuelo de la reserva y el cliente pregunta qué pasa con su viaje o no está de acuerdo.
metadata:
  titulo: La aerolínea ha cambiado el horario
  area: vuelos-ferris-y-circuitos
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-vuelo
    - consultar-reserva
    - consultar-traslados
    - crear-ticket-booking
  informacion:
    - vuelos/vuelos-y-equipaje
  plantillas:
    - derivado-a-booking
  simulado: "true"
---
## Cuándo aplica

- El cliente ha recibido un aviso de cambio de horario de la aerolínea, o ve otro horario en su vuelo.
- Pregunta qué pasa con su viaje, quiere otra opción o pide una compensación.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-vuelo` el horario y el estado actual de los vuelos.
3. Mira con `consultar-reserva` qué otros servicios dependen del vuelo, como el hotel o las entradas.
4. Mira con `consultar-traslados` si hay traslados que puedan quedar afectados.
5. Le dice al cliente el horario actual tal como lo devuelve la acción.
6. Explica cómo se gestionan los cambios de horario según `vuelos/vuelos-y-equipaje`.
7. Pasa el caso a booking con `crear-ticket-booking`, con el horario que tenía el cliente, el que devuelve la acción, los servicios afectados y lo que pide el cliente.
8. Responde con la plantilla `derivado-a-booking`.

## Qué no hace

- No promete compensaciones, devoluciones ni otro vuelo.
- No dice si el cambio da derecho a algo.
- No cambia traslados, hotel ni entradas.

## Cuándo pasa a una persona

- Siempre. Los cambios de horario los gestiona booking con la aerolínea.

## Cómo lo puede pedir el cliente

- «Me ha llegado un email de que mi vuelo sale cinco horas más tarde, ¿qué hago?»
- «nos han cambiado el vuelo y ahora perdemos una noche de hotel!!»
- «Buongiorno, la compagnia aerea ha anticipato il volo di ritorno. Cosa succede con il transfer?»
- «Quiero que me devolváis el dinero porque el nuevo horario no me vale.»
