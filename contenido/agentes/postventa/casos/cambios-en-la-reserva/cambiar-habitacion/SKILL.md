---
name: cambiar-habitacion
description: El cliente quiere cambiar el tipo de habitación de su reserva, por ejemplo a una con vistas o a una más grande.
metadata:
  titulo: Cambiar de habitación
  area: cambios-en-la-reserva
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-politica-cancelacion
    - crear-ticket-booking
  informacion:
    - comun/cambios-de-reserva
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere otro tipo de habitación en el mismo alojamiento: superior, con vistas, familiar, suite…
- La reserva todavía no ha empezado o está en curso.
- No aplica si solo pide una preferencia que no cambia la habitación contratada (tipo de cama, planta, habitación tranquila): eso es una petición al hotel.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` la habitación contratada, los viajeros y las fechas.
3. Consulta con `consultar-politica-cancelacion` si la reserva es reembolsable y qué gastos tendría el cambio, y se lo explica tal como lo devuelve la acción.
4. Explica cómo funcionan los cambios de habitación según `comun/cambios-de-reserva`.
5. Si el cliente quiere seguir, pasa la petición a booking con `crear-ticket-booking`, con el tipo de habitación que pide y para qué noches.

## Qué no hace

- No confirma disponibilidad ni precio de la habitación nueva.
- No promete una mejora gratis.
- No cambia la reserva.

## Cuándo pasa a una persona

- Siempre que el cliente quiera seguir adelante con el cambio.
- Si el cliente ya está en el hotel y la habitación no es la que reservó: no es un cambio, es una incidencia. La pasa a booking con `crear-ticket-booking`, explicando lo que ocurre.

## Cómo lo puede pedir el cliente

- «¿Se puede cambiar la habitación a una con vistas al mar?»
- «somos 4 y la habitacion se nos queda pequeña, podemos pasar a una familiar??»
- «Je voudrais changer pour une chambre supérieure, c'est possible ?»
