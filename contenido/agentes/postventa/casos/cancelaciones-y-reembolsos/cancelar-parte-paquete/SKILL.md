---
name: cancelar-parte-paquete
description: El cliente quiere cancelar solo uno de los servicios de un paquete, por ejemplo las entradas o el vuelo, y mantener el resto.
metadata:
  titulo: Cancelar una parte del paquete
  area: cancelaciones-y-reembolsos
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-politica-cancelacion
    - crear-ticket-booking
  informacion:
    - comun/cancelaciones-y-reembolsos
    - comun/cambios-de-reserva
  simulado: "true"
---
## Cuándo aplica

- La reserva es un paquete con varios servicios.
- El cliente quiere quitar uno o varios servicios y quedarse con los demás.
- No aplica si quiere cambiar un servicio por otro: eso es un cambio y se explica según `comun/cambios-de-reserva`.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` qué servicios tiene el paquete y cuál quiere cancelar.
3. Consulta con `consultar-politica-cancelacion` los gastos de cancelar ese servicio y se los explica tal como los devuelve la acción.
4. Explica cómo funcionan las cancelaciones parciales según `comun/cancelaciones-y-reembolsos`.
5. Si el cliente quiere seguir, pasa la petición a booking con `crear-ticket-booking`, con el servicio que se cancela y los que se mantienen.

## Qué no hace

- No calcula la diferencia de precio ni la devolución.
- No confirma que el precio del resto del paquete se mantiene.
- No cancela nada él mismo.

## Cuándo pasa a una persona

- Siempre que el cliente quiera seguir adelante.
- Si `consultar-politica-cancelacion` no da gastos separados para ese servicio.

## Cómo lo puede pedir el cliente

- «Queremos quitar las entradas del parque pero mantener el hotel.»
- «se puede cancelar solo el vuelo de vuelta? volvemos en coche»
- «Bonjour, est-ce qu'on peut annuler seulement le ferry et garder l'hôtel ?»
