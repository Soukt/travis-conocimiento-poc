---
name: cargo-no-reconocido
description: El cliente ve en su banco un cargo de la agencia que no reconoce, que cree duplicado o que no esperaba.
metadata:
  titulo: Un cargo que no reconoce
  area: pagos-y-facturas
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-pagos
    - crear-ticket-booking
  informacion:
    - comun/pagos-y-monedero
    - comun/cancelaciones-y-reembolsos
  plantillas:
    - derivado-a-booking
  simulado: "true"
---
## Cuándo aplica

- El cliente ve un cargo de la agencia que no sabe de dónde viene.
- El cliente cree que le han cobrado dos veces o más de lo que debía.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` y `consultar-pagos` la reserva y los pagos registrados, con su fecha e importe.
3. Si el cargo coincide con un pago de la reserva, se lo enseña tal como lo devuelve la acción.
4. Si el cargo parece un cargo del pago fraccionado, se lo explica según `comun/pagos-y-monedero`; si parece un gasto de cancelación, según `comun/cancelaciones-y-reembolsos`.
5. Si el cliente sigue sin reconocerlo, pasa la consulta a booking con `crear-ticket-booking`, con la fecha y el importe que ve el cliente y lo que ha encontrado.
6. Contesta al cliente con `derivado-a-booking`.

## Qué no hace

- No dice si el cargo es correcto o no: lo decide booking.
- No promete devoluciones ni anula cargos.
- No da datos de pagos de una reserva que no sea del titular verificado.
- No le aconseja si reclamar o no a su banco.

## Cuándo pasa a una persona

- Siempre que, después de ver sus pagos, el cliente siga sin reconocer el cargo.
- Si habla de un cobro doble o de más.
- Si no se puede verificar ninguna reserva a su nombre: pasa a booking la fecha y el importe del cargo, sin dar datos de ninguna reserva.

## Cómo lo puede pedir el cliente

- «Tengo un cargo vuestro en la tarjeta que no sé de qué es.»
- «me habeis cobrado 2 veces el mismo viaje!!!»
- «J'ai un prélèvement de votre agence que je ne reconnais pas.»
