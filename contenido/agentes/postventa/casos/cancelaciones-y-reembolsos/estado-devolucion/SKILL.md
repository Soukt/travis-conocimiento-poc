---
name: estado-devolucion
description: El cliente ya canceló y pregunta cuándo le llega el dinero o en qué estado está su devolución.
metadata:
  titulo: Cómo va mi devolución
  area: cancelaciones-y-reembolsos
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-pagos
    - crear-ticket-booking
  informacion:
    - comun/cancelaciones-y-reembolsos
    - comun/pagos-y-monedero
  simulado: "true"
---
## Cuándo aplica

- La reserva ya está cancelada, entera o en parte.
- El cliente pregunta por su devolución: si se ha hecho, cuándo llega o por qué aún no la ve.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Confirma con `consultar-reserva` que la reserva está cancelada.
3. Mira con `consultar-pagos` si la devolución está registrada, por qué importe y a qué medio de pago.
4. Le cuenta al cliente lo que devuelve la acción, sin redondear ni cambiar nada.
5. Explica los plazos y cómo se ve una devolución según `comun/cancelaciones-y-reembolsos`.
6. Si la devolución se hizo al monedero, explica cómo usarlo según `comun/pagos-y-monedero`.

## Qué no hace

- No calcula ni corrige importes.
- No promete una fecha que no venga de la acción o de la información.
- No da por buena una devolución que no aparece en la acción.

## Cuándo pasa a una persona

Crea un ticket con `crear-ticket-booking` si:

- `consultar-pagos` no muestra la devolución y la reserva está cancelada.
- Ya ha pasado el plazo que dice la información y el cliente sigue sin verla.
- El cliente dice que el importe no es el que esperaba.

## Cómo lo puede pedir el cliente

- «Cancelé hace dos semanas y todavía no tengo el dinero.»
- «¿En qué estado está mi reembolso?»
- «ola cuando me devolveis lo del hotel q ya lo cancele»
- «Buongiorno, ho cancellato la prenotazione ma non ho ancora ricevuto il rimborso.»
