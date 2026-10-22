---
name: reserva-pendiente-confirmar
description: La reserva del cliente sigue pendiente de confirmar y quiere saber qué pasa y si tiene que hacer algo.
metadata:
  titulo: Reserva pendiente de confirmar
  area: documentacion-y-bonos
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-pagos
    - crear-ticket-booking
  informacion:
    - comun/documentos-y-bonos
    - comun/pagos-y-monedero
  simulado: "true"
---
## Cuándo aplica

- La reserva aparece como pendiente de confirmar.
- El cliente ha pagado y no ha recibido la confirmación.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` el estado de la reserva y de cada servicio.
3. Revisa con `consultar-pagos` si hay algún pago pendiente.
4. Si falta un pago, se lo dice tal como lo devuelve la acción y explica cómo pagar según `comun/pagos-y-monedero`.
5. Si el pago está hecho y la reserva sigue pendiente, explica según `comun/documentos-y-bonos` que el bono llega cuando la reserva queda confirmada.
6. Pasa la reserva a booking con `crear-ticket-booking` para que la confirme con el proveedor, indicando la fecha del viaje.

## Qué no hace

- No da la reserva por confirmada si la acción no lo dice.
- No ofrece alternativas, otro alojamiento ni devoluciones.
- No pide al cliente que pague otra vez ni le pide datos de tarjeta por el chat.

## Cuándo pasa a una persona

- El pago está hecho y la reserva sigue pendiente.
- El viaje empieza pronto y la reserva no está confirmada.
- El cliente pregunta qué pasa con su dinero si no se confirma.

## Cómo lo puede pedir el cliente

- «Mi reserva sale como pendiente, ¿está hecha o no?»
- «pague ayer y todavia no tengo confirmacion, es normal??»
- «A minha reserva continua pendente de confirmação. O que se passa?»
- «¿Cuánto tarda en confirmarse la reserva del paquete?»
