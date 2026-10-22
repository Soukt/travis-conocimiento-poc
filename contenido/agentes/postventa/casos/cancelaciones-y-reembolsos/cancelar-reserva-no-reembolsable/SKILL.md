---
name: cancelar-reserva-no-reembolsable
description: El cliente quiere cancelar una reserva no reembolsable y pregunta si recupera algo.
metadata:
  titulo: Cancelar una reserva no reembolsable
  area: cancelaciones-y-reembolsos
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-politica-cancelacion
    - crear-ticket-booking
  informacion:
    - comun/cancelaciones-y-reembolsos
    - comun/seguro
  plantillas:
    - reserva-no-reembolsable
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere cancelar o pregunta qué pasa si no va.
- `consultar-politica-cancelacion` dice que la reserva es no reembolsable.
- No aplica si cancela por enfermedad: eso tiene su propio caso.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` los servicios, las fechas y si la reserva incluye seguro.
3. Confirma con `consultar-politica-cancelacion` que la reserva es no reembolsable.
4. Responde con la plantilla `reserva-no-reembolsable` y explica las condiciones tal como las devuelve la acción.
5. Para las dudas generales sobre cancelar, responde según `comun/cancelaciones-y-reembolsos`.
6. Si la reserva tiene seguro, explica cuándo puede cubrir una cancelación según `comun/seguro`.
7. Si el cliente quiere cancelar igualmente, por ejemplo para liberar la habitación, pasa la petición a booking con `crear-ticket-booking`.

## Qué no hace

- No promete devoluciones ni excepciones.
- No dice si el seguro cubre su caso: eso lo decide booking.
- No cancela la reserva él mismo.

## Cuándo pasa a una persona

- Si el cliente quiere cancelar igualmente.
- Si pide una excepción o una devolución parcial.
- Si `consultar-politica-cancelacion` no deja claro que la reserva sea no reembolsable.

## Cómo lo puede pedir el cliente

- «Tengo una reserva no reembolsable, ¿hay alguna forma de recuperar algo?»
- «si no vamos al hotel nos devolveis algo aunque sea poco»
- «Olá, a minha reserva é não reembolsável mas não vou poder ir. Perco tudo?»
