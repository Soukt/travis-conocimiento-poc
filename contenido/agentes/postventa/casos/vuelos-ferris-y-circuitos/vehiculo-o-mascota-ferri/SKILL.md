---
name: vehiculo-o-mascota-ferri
description: El cliente pregunta si puede llevar su coche, su moto o su mascota en el ferri, o quiere añadirlos a su trayecto.
metadata:
  titulo: Coche o mascota en el ferri
  area: vuelos-ferris-y-circuitos
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-trayecto-ferri
    - crear-ticket-booking
  informacion:
    - ferris/ferris
    - comun/cambios-de-reserva
  simulado: "true"
---
## Cuándo aplica

- El cliente tiene un trayecto en ferri reservado.
- Pregunta si lleva incluido un vehículo o una mascota, o quiere añadirlo o cambiarlo.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-trayecto-ferri` si la reserva incluye vehículo y qué acomodación tiene.
3. Si el vehículo ya está incluido, le dice el que figura, tal como lo devuelve la acción.
4. Para las condiciones generales de viajar con vehículo o con mascota, responde según `ferris/ferris`.
5. Si quiere añadir o cambiar un vehículo o una mascota, explica cómo funcionan los cambios según `comun/cambios-de-reserva`.
6. Pasa esa petición a booking con `crear-ticket-booking`, con el tipo de vehículo o de mascota.

## Qué no hace

- No confirma plazas para vehículos ni para mascotas.
- No da el precio de añadirlos.
- No da por hecho que una mascota está incluida si la acción no lo muestra.
- No cambia la reserva.

## Cuándo pasa a una persona

- Siempre que el cliente quiera añadir o cambiar un vehículo o una mascota.
- Si pregunta por una mascota y la acción no dice nada de ella.
- Si el vehículo que figura no es el que va a llevar.

## Cómo lo puede pedir el cliente

- «¿Puedo llevar a mi perro en el barco?»
- «al final vamos con la furgo en vez del coche, hay q cambiar algo?»
- «Bonjour, on voyage avec notre chat, est-ce qu'il peut venir sur le ferry ?»
- «Quiero añadir la moto a la reserva del ferri.»
