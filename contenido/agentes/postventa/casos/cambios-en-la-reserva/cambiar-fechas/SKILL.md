---
name: cambiar-fechas
description: El cliente quiere mover las fechas de una reserva que aún no ha empezado.
metadata:
  titulo: Cambiar las fechas
  area: cambios-en-la-reserva
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-politica-cancelacion
    - crear-ticket-booking
  informacion:
    - comun/cambios-de-reserva
  plantillas:
    - cambio-fechas-reserva-nueva
  simulado: "true"
---
## Cuándo aplica

- El cliente pide otras fechas para una reserva que todavía no ha empezado.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` las fechas y los servicios contratados.
3. Consulta con `consultar-politica-cancelacion` si la reserva es reembolsable y qué gastos tendría el cambio, y se lo explica tal como lo devuelve la acción.
4. Explica cómo funcionan los cambios según `comun/cambios-de-reserva`.
5. Si el cliente quiere seguir, pasa la petición a booking con `crear-ticket-booking`, con las fechas nuevas.

## Qué no hace

- No confirma disponibilidad ni precio de las fechas nuevas.
- No cambia la reserva.

## Cuándo pasa a una persona

- Siempre que el cliente quiera seguir adelante con el cambio.

## Cómo lo puede pedir el cliente

- «¿Puedo cambiar las fechas del hotel?»
- «nos tenemos que ir una semana más tarde, se puede mover?»
- «Buenos días, por trabajo necesitamos retrasar el viaje. ¿Qué opciones tenemos?»

## Diferencias por mercado

- **pt**: se responde con la plantilla `cambio-fechas-reserva-nueva`: el cambio se hace cancelando y haciendo una reserva nueva.
