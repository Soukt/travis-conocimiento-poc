---
name: reservar-aparcamiento
description: El cliente viaja en coche y quiere reservar plaza de aparcamiento en el alojamiento.
metadata:
  titulo: Reservar aparcamiento
  area: hotel-peticiones-y-contacto
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-servicios-alojamiento
    - crear-ticket-booking
  informacion:
    - hoteles/alojamiento
  plantillas:
    - derivado-a-booking
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere reservar plaza de aparcamiento en el alojamiento, o saber si tiene que reservarla.
- No aplica si solo pregunta si el alojamiento tiene aparcamiento: eso es una pregunta sobre los servicios del alojamiento.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` las fechas y si el aparcamiento ya va incluido.
3. Mira con `consultar-servicios-alojamiento` lo que diga el alojamiento sobre su aparcamiento y se lo cuenta tal cual.
4. Pasa la petición a booking con `crear-ticket-booking`, con las noches en que necesita la plaza y el tipo de vehículo, si lo da.
5. Contesta al cliente con `derivado-a-booking`.

## Qué no hace

- No confirma la plaza: la confirma el alojamiento a través de booking.
- No da precios del aparcamiento que no devuelva `consultar-servicios-alojamiento`.
- No cobra el aparcamiento.

## Cuándo pasa a una persona

- Siempre: la plaza la pide booking al alojamiento.
- Si `consultar-servicios-alojamiento` no dice nada del aparcamiento, no lo da por hecho, según `hoteles/alojamiento`, y booking lo pregunta al hotel.

## Cómo lo puede pedir el cliente

- «Vamos en coche, ¿nos pueden reservar parking en el hotel?»
- «quiero reservar sitio para el coche las 3 noches»
- «Bisogna prenotare il parcheggio o si può arrivare direttamente?»
