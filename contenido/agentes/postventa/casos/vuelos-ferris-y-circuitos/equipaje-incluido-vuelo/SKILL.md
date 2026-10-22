---
name: equipaje-incluido-vuelo
description: El cliente pregunta qué equipaje lleva incluido su vuelo o si puede añadir maletas.
metadata:
  titulo: Equipaje incluido en el vuelo
  area: vuelos-ferris-y-circuitos
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-vuelo
    - crear-ticket-booking
  informacion:
    - vuelos/vuelos-y-equipaje
  simulado: "true"
---
## Cuándo aplica

- El cliente tiene un vuelo reservado y pregunta qué equipaje incluye.
- También si pregunta si puede añadir maletas o llevar equipaje especial.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-vuelo` el equipaje incluido en cada vuelo.
3. Se lo explica tal como lo devuelve la acción, vuelo por vuelo, porque la ida y la vuelta pueden ser distintas.
4. Para dudas generales, como el equipaje de mano o lo que no se puede llevar, responde según `vuelos/vuelos-y-equipaje`.
5. Si quiere añadir maletas o llevar equipaje especial, pasa la petición a booking con `crear-ticket-booking`.

## Qué no hace

- No da medidas ni pesos que no vengan de la acción o de la información.
- No confirma el precio de una maleta extra.
- No añade equipaje él mismo.

## Cuándo pasa a una persona

- Si el cliente quiere añadir equipaje o llevar equipaje especial, como material deportivo o un instrumento.
- Si `consultar-vuelo` no devuelve el equipaje de algún vuelo.

## Cómo lo puede pedir el cliente

- «¿Qué maletas entran en mi vuelo?»
- «llevo maleta facturada incluida o solo la de mano??»
- «Olá, o meu voo inclui bagagem de porão?»
- «Quiero añadir una maleta a la vuelta, ¿se puede?»
