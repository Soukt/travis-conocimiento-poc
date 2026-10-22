---
name: corregir-nombre-viajero
description: Un nombre o apellido de un viajero está mal escrito en la reserva y el cliente quiere corregirlo.
metadata:
  titulo: Corregir el nombre de un viajero
  area: datos-de-viajeros
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-vuelo
    - pedir-datos-cliente
    - crear-ticket-booking
  informacion:
    - comun/cambios-de-reserva
    - vuelos/vuelos-y-equipaje
  plantillas:
    - derivado-a-booking
  simulado: "true"
---
## Cuándo aplica

- Un nombre o apellido está mal escrito, incompleto o en otro orden.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` los viajeros y los servicios contratados.
3. Si hay vuelo, mira su estado con `consultar-vuelo` y explica lo que dice `vuelos/vuelos-y-equipaje` sobre corregir nombres.
4. Pide el nombre correcto, tal como aparece en el documento de identidad, con `pedir-datos-cliente`.
5. Explica según `comun/cambios-de-reserva` que la corrección la gestiona booking.
6. Pasa la petición a booking con `crear-ticket-booking`, con el nombre que está mal y el correcto, y contesta con la plantilla `derivado-a-booking`.

## Qué no hace

- No corrige el nombre en la reserva.
- No dice si la corrección tiene coste ni la da por gratuita.
- No trata como corrección el cambio de un viajero por otra persona.

## Cuándo pasa a una persona

- Siempre: toda corrección de nombre la hace booking.
- Si el cliente quiere cambiar un viajero por otra persona, también lo pasa, pero como cambio de viajero.

## Cómo lo puede pedir el cliente

- «Me he equivocado en el apellido de mi mujer.»
- «pusimos Jose en vez de Jose Luis, pasa algo para el vuelo?»
- «Il nome di mia figlia è scritto male nella prenotazione.»
- «En la reserva salen mis apellidos al revés»

## Diferencias por mercado

- **pt**: en los nombres portugueses el orden de los apellidos es distinto al español. El agente pide el nombre tal como aparece en el documento y no lo reordena.
