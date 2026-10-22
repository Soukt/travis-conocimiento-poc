---
name: saldo-monedero
description: El cliente pregunta por el saldo de su monedero, dónde verlo, de dónde sale o cómo usarlo en una reserva.
metadata:
  titulo: Saldo del monedero
  area: pagos-y-facturas
  modo: autonomo
  acciones:
    - verificar-identidad
    - crear-ticket-booking
  informacion:
    - comun/pagos-y-monedero
    - comun/cancelaciones-y-reembolsos
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere saber cuánto saldo tiene en el monedero o dónde verlo.
- El cliente pregunta cómo usar el saldo en una reserva nueva.
- El cliente esperaba un saldo en el monedero, por ejemplo tras una cancelación, y no lo ve.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Explica qué es el monedero, dónde se ven el saldo y su caducidad y cómo se usa, según `comun/pagos-y-monedero`.
3. Si el saldo viene de una cancelación, explica cómo se devuelve el dinero según `comun/cancelaciones-y-reembolsos`.
4. Si el cliente esperaba un saldo y no lo ve, pasa la consulta a booking con `crear-ticket-booking`, con la reserva de la que debería venir.

## Qué no hace

- No dice cuánto saldo tiene: no lo devuelve ninguna acción. Le indica dónde verlo.
- No añade, quita ni mueve saldo.
- No cambia saldo del monedero por dinero.

## Cuándo pasa a una persona

- Si el cliente esperaba un saldo y no lo ve, o cree que no es correcto.
- Si quiere que el saldo se le devuelva en su medio de pago: lo decide booking, y lo pasa con `crear-ticket-booking`.

## Cómo lo puede pedir el cliente

- «¿Cuánto dinero tengo en el monedero?»
- «me dijeron q me quedaba saldo de la cancelacion y no lo veo»
- «Come posso usare il credito del portafoglio per una nuova prenotazione?»

## Diferencias por mercado

- **it**: las devoluciones se ofrecen primero como saldo en el monedero, según `comun/cancelaciones-y-reembolsos`. Si el cliente prefiere el dinero en su medio de pago, se indica en el ticket a booking.
