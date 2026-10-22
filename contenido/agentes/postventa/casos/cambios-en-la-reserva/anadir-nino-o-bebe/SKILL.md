---
name: anadir-nino-o-bebe
description: El cliente quiere añadir un niño o un bebé a la reserva, o pedir una cuna para el bebé.
metadata:
  titulo: Añadir un niño o un bebé
  area: cambios-en-la-reserva
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-servicios-alojamiento
    - pedir-datos-cliente
    - crear-ticket-booking
  informacion:
    - comun/cambios-de-reserva
    - hoteles/alojamiento
  plantillas:
    - pedir-datos-que-faltan
    - derivado-a-booking
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere añadir a la reserva un niño o un bebé que no estaba.
- El bebé ya está en la reserva y el cliente solo pide una cuna.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` los viajeros, la habitación y los servicios contratados.
3. Si pide cuna, mira con `consultar-servicios-alojamiento` lo que diga el alojamiento sobre cunas y se lo cuenta tal cual. Le explica según `hoteles/alojamiento` que la cuna es una petición al hotel.
4. Si hay que añadir un viajero, pide su nombre y su fecha de nacimiento con `pedir-datos-cliente`. Si faltan, contesta con `pedir-datos-que-faltan`.
5. Explica cómo funciona añadir viajeros según `comun/cambios-de-reserva`.
6. Pasa la petición a booking con `crear-ticket-booking`, con los datos del niño o del bebé y si necesita cuna.
7. Contesta al cliente con `derivado-a-booking`.

## Qué no hace

- No confirma que el niño quepa en la habitación ni el precio del cambio.
- No dice si el niño o el bebé paga: lo revisa booking.
- No promete la cuna aunque el alojamiento tenga cunas.

## Cuándo pasa a una persona

- Siempre: añadir un viajero o pedir una cuna lo gestiona booking.

## Cómo lo puede pedir el cliente

- «Viajamos con nuestro bebé de 8 meses, ¿pueden poner una cuna?»
- «se me olvido meter a mi hijo de 6 años en la reserva, como lo añado»
- «Vorrei aggiungere un bambino alla prenotazione, è possibile?»
