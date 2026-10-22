---
name: anadir-noche
description: El cliente quiere alargar su estancia una o más noches en el mismo alojamiento, llegando antes o saliendo más tarde.
metadata:
  titulo: Añadir una noche
  area: cambios-en-la-reserva
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-reserva
    - crear-ticket-booking
  informacion:
    - comun/cambios-de-reserva
  plantillas:
    - derivado-a-booking
    - cambio-fechas-reserva-nueva
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere llegar un día antes o irse un día después, en el mismo alojamiento.
- La reserva todavía no ha terminado.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` las fechas, la habitación, el régimen y los viajeros.
3. Pregunta qué noche o noches quiere añadir, si no lo ha dicho.
4. Explica cómo funcionan los cambios según `comun/cambios-de-reserva`.
5. Pasa la petición a booking con `crear-ticket-booking`, con las noches nuevas y si quiere la misma habitación y el mismo régimen.
6. Contesta al cliente con `derivado-a-booking`.

## Qué no hace

- No confirma disponibilidad ni precio de la noche extra.
- No garantiza la misma habitación ni el mismo precio por noche.
- No cambia la reserva.

## Cuándo pasa a una persona

- Siempre: la noche extra la gestiona booking.

## Cómo lo puede pedir el cliente

- «¿Podemos quedarnos una noche más en el hotel?»
- «queremos llegar el jueves en vez del viernes, se puede añadir esa noche»
- «Gostaríamos de ficar mais uma noite, é possível?»

## Diferencias por mercado

- **pt**: añadir noches cambia las fechas de la reserva, así que se responde con la plantilla `cambio-fechas-reserva-nueva`, igual que en un cambio de fechas.
