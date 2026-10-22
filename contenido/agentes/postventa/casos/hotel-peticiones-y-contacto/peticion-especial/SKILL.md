---
name: peticion-especial
description: El cliente quiere pedir algo concreto al hotel para su habitación, como cama de matrimonio, habitación tranquila, planta alta o habitaciones juntas.
metadata:
  titulo: Petición especial al hotel
  area: hotel-peticiones-y-contacto
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - crear-ticket-booking
  informacion:
    - hoteles/alojamiento
  simulado: "true"
---
## Cuándo aplica

- El cliente pide una preferencia sobre la habitación: tipo de cama, habitación tranquila, planta alta o baja, habitaciones juntas.
- No aplica si lo que pide es otro tipo de habitación: eso es un cambio de habitación.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` el alojamiento, la habitación contratada y las fechas.
3. Explica cómo funcionan las peticiones al hotel según `hoteles/alojamiento`.
4. Pasa la petición a booking con `crear-ticket-booking`, con las palabras del cliente, para que la envíe al alojamiento.

## Qué no hace

- No garantiza la petición.
- No cambia la habitación contratada.
- No confirma ningún coste de la petición: si lo tiene, lo confirma el hotel.

## Cuándo pasa a una persona

- Siempre que el cliente quiera que la petición llegue al alojamiento.
- Si la petición es por salud o accesibilidad, como una habitación adaptada: no da por hecho que el alojamiento la tenga y lo indica así en el ticket.

## Cómo lo puede pedir el cliente

- «¿Pueden pedir al hotel que nos den cama de matrimonio?»
- «porfa una habitacion tranquila q mi marido duerme fatal»
- «Est-ce qu'on peut avoir deux chambres côte à côte ?»

## Diferencias por mercado

- **pt**, **it** y **fr**: en el ticket, la petición va en español y además con el texto original del cliente, para no perder el matiz. Por ejemplo, «cama de casal», «letto matrimoniale» y «lit double» son cama de matrimonio.
