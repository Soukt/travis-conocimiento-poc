---
name: cancelar-reserva-reembolsable
description: El cliente quiere cancelar una reserva reembolsable que todavía no ha empezado y saber qué le devolverían.
metadata:
  titulo: Cancelar una reserva reembolsable
  area: cancelaciones-y-reembolsos
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-politica-cancelacion
    - crear-ticket-booking
  informacion:
    - comun/cancelaciones-y-reembolsos
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere cancelar toda la reserva.
- La reserva todavía no ha empezado.
- `consultar-politica-cancelacion` dice que la reserva es reembolsable.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` los servicios contratados y el estado de la reserva.
3. Consulta con `consultar-politica-cancelacion` los gastos que tendría cancelar hoy y se los explica tal como los devuelve la acción.
4. Explica cómo funciona una cancelación y cómo llega la devolución según `comun/cancelaciones-y-reembolsos`.
5. Pregunta al cliente si quiere seguir adelante.
6. Si confirma, pasa la cancelación a booking con `crear-ticket-booking`, con la fecha de la petición y los servicios que se cancelan.

## Qué no hace

- No cancela la reserva él mismo.
- No confirma el importe final de la devolución: lo confirma booking.
- No ofrece descuentos ni cambios a cambio de no cancelar.

## Cuándo pasa a una persona

- Siempre que el cliente confirme que quiere cancelar.
- Si `consultar-politica-cancelacion` no devuelve gastos claros para hoy.
- Si el cliente no está de acuerdo con los gastos.
- Si la reserva ya ha empezado.

## Cómo lo puede pedir el cliente

- «Quiero cancelar mi reserva, ¿cuánto me devolvéis?»
- «hola al final no podemos ir, como cancelo??»
- «Bonjour, je souhaite annuler ma réservation. Est-ce que je serai remboursé ?»
