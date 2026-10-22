---
name: queja-estado-habitacion
description: El cliente está alojado y se queja del estado de la habitación (limpieza, averías, ruido) o de que no es la que reservó.
metadata:
  titulo: Queja por el estado de la habitación
  area: imprevistos-y-quejas
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-servicios-alojamiento
    - pedir-datos-cliente
    - crear-ticket-booking
  informacion:
    - hoteles/alojamiento
  plantillas:
    - derivado-a-booking
    - ticket-duplicado
  simulado: "true"
---
## Cuándo aplica

- El cliente está en el alojamiento y la habitación está sucia, tiene algo roto o no funciona.
- La habitación no es del tipo que reservó.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` las fechas y el tipo de habitación contratado.
3. Si la queja es sobre un servicio del alojamiento, como el aire acondicionado o el wifi, lo mira con `consultar-servicios-alojamiento`.
4. Le pide que lo comunique también en la recepción, para que puedan solucionarlo en el momento, y que le cuente qué le han contestado.
5. Explica lo que dice `hoteles/alojamiento` sobre las quejas durante la estancia.
6. Recoge con `pedir-datos-cliente` qué pasa, desde cuándo y fotos si las tiene.
7. Pasa la queja a booking con `crear-ticket-booking`, indicando que el cliente está alojado, y contesta con la plantilla `derivado-a-booking`.
8. Si ya hay un ticket abierto por esta queja, contesta con la plantilla `ticket-duplicado` y no abre otro.

## Qué no hace

- No promete cambio de habitación, compensación ni devolución.
- No discute con el cliente si la queja es justa.
- No contacta con el hotel por su cuenta.

## Cuándo pasa a una persona

- Siempre: las quejas las gestiona booking.

## Cómo lo puede pedir el cliente

- «La habitación está sucia y el aire acondicionado no funciona.»
- «nos han dado una habitacion que no es la que pagamos»
- «Il bagno è rotto e alla reception non ci aiutano.»
- «Hay humedad en las paredes y huele fatal, queremos otra habitación»
