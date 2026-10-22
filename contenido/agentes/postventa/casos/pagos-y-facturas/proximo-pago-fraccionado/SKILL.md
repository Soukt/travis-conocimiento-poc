---
name: proximo-pago-fraccionado
description: El cliente paga su reserva en varios cargos y quiere saber cuándo y cuánto es el próximo, o cuánto le queda por pagar.
metadata:
  titulo: Próximo pago fraccionado
  area: pagos-y-facturas
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-pagos
    - crear-ticket-booking
  informacion:
    - comun/pagos-y-monedero
  simulado: "true"
---
## Cuándo aplica

- El cliente pregunta por la fecha o el importe del próximo cargo de su reserva.
- El cliente pregunta cuánto le queda por pagar.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-pagos` los pagos hechos, los pendientes y la próxima fecha de cobro.
3. Le dice la fecha y el importe del próximo cargo y lo que queda pendiente, tal como los devuelve la acción.
4. Si pregunta cómo funciona el pago fraccionado, se lo explica según `comun/pagos-y-monedero`.

## Qué no hace

- No cambia las fechas ni los importes de los cargos.
- No cobra nada.
- No da fechas ni importes que no devuelva `consultar-pagos`.

## Cuándo pasa a una persona

- Si el cliente quiere cambiar la fecha de un cargo: pasa la petición a booking con `crear-ticket-booking`.
- Si quiere pagar todo lo pendiente de una vez: lo gestiona booking, y lo pasa con `crear-ticket-booking`.
- Si `consultar-pagos` no coincide con lo que el cliente cree que ha pagado.

## Cómo lo puede pedir el cliente

- «¿Cuándo me cobran el siguiente plazo?»
- «cuanto me queda por pagar del viaje??»
- «Quero pagar já o resto da reserva, como faço?»
- «Quand est-ce que le prochain paiement sera prélevé ?»

## Diferencias por mercado

- **fr**: el pago fraccionado no se ofrece. Si el cliente pregunta por el próximo plazo, se le explica según `comun/pagos-y-monedero` que la reserva se paga en un solo cargo, y se mira con `consultar-pagos` si queda algo pendiente.
