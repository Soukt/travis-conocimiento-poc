---
name: pago-fallido
description: Un cargo de la reserva ha fallado o ha sido rechazado y el cliente quiere saber qué pasa y cómo pagar.
metadata:
  titulo: Un pago que ha fallado
  area: pagos-y-facturas
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-pagos
    - crear-ticket-booking
  informacion:
    - comun/pagos-y-monedero
  simulado: "true"
---
## Cuándo aplica

- El cliente ha recibido un aviso de pago rechazado o fallido.
- El cliente intentó pagar un cargo pendiente y no pudo.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-pagos` qué cargo ha fallado, qué queda pendiente y la próxima fecha de cobro.
3. Mira con `consultar-reserva` el estado de la reserva y se lo dice tal como lo devuelve la acción.
4. Explica qué hacer cuando falla un cargo según `comun/pagos-y-monedero`.
5. Si el cliente quiere pagar por otro medio o no consigue pagar, pasa la petición a booking con `crear-ticket-booking`, con el cargo que ha fallado.

## Qué no hace

- No dice por su cuenta si la reserva se va a cancelar: da el estado que devuelve `consultar-reserva` y lo que dice `comun/pagos-y-monedero`.
- No pide ni recoge datos de tarjeta por el chat.
- No da más plazo para pagar.

## Cuándo pasa a una persona

- Si el cliente quiere pagar por otro medio o no consigue pagar.
- Si `consultar-pagos` no muestra ningún cargo fallido pero el cliente dice que le han rechazado un pago.
- Si la reserva aparece cancelada.

## Cómo lo puede pedir el cliente

- «Me ha llegado un email diciendo que el pago ha fallado, ¿qué hago?»
- «no me deja pagar el segundo plazo, me da error la tarjeta»
- «O pagamento foi recusado, a minha reserva ainda está ativa?»
