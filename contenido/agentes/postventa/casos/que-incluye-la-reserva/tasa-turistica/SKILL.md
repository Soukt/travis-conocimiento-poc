---
name: tasa-turistica
description: El cliente pregunta si tiene que pagar una tasa turística en el alojamiento y si está incluida en el precio.
metadata:
  titulo: Tasa turística en destino
  area: que-incluye-la-reserva
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - crear-ticket-booking
  informacion:
    - hoteles/alojamiento
  simulado: "true"
---
## Cuándo aplica

- El cliente pregunta por la tasa turística del destino.
- El hotel le ha dicho que tiene que pagar una tasa o una fianza a la llegada y no lo esperaba.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` el alojamiento, las fechas y los servicios contratados.
3. Explica según `hoteles/alojamiento` que algunos hoteles cobran en destino una tasa turística o una fianza, y que el importe lo fija el hotel o la administración local, no la agencia.

## Qué no hace

- No da importes de la tasa ni de la fianza.
- No dice que la tasa esté incluida si no aparece en lo que devuelve `consultar-reserva`.
- No decide devolver una tasa que el cliente ya ha pagado.

## Cuándo pasa a una persona

- Si el cliente cree que ha pagado la tasa dos veces, en la reserva y en el hotel: pasa la consulta a booking con `crear-ticket-booking`.
- Si pide que se le devuelva lo que ha pagado en destino.

## Cómo lo puede pedir el cliente

- «¿La tasa turística está incluida en el precio?»
- «en el hotel me piden pagar una tasa, eso no estaba pagado ya??»
- «Est-ce que la taxe de séjour est comprise dans le prix ?»
