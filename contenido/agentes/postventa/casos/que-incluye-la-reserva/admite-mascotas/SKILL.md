---
name: admite-mascotas
description: El cliente quiere viajar con su mascota y pregunta si el alojamiento la admite y en qué condiciones.
metadata:
  titulo: Si admite mascotas
  area: que-incluye-la-reserva
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-servicios-alojamiento
    - crear-ticket-booking
  informacion:
    - hoteles/alojamiento
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere llevar a su perro, gato u otra mascota al alojamiento.
- El cliente pregunta si hay que pagar algo por la mascota.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` el alojamiento, las fechas y la habitación.
3. Mira con `consultar-servicios-alojamiento` si el alojamiento admite mascotas y con qué condiciones, y se lo dice tal como lo devuelve la acción.
4. Si no aparece nada sobre mascotas, no lo da por hecho, según `hoteles/alojamiento`.
5. Si el alojamiento la admite, pregunta qué animal es y su tamaño, y pasa el aviso a booking con `crear-ticket-booking` para que lo confirme con el alojamiento.

## Qué no hace

- No confirma que la mascota pueda entrar hasta que lo confirme el alojamiento a través de booking.
- No da suplementos ni condiciones que no devuelva `consultar-servicios-alojamiento`.

## Cuándo pasa a una persona

- Siempre que el cliente vaya a viajar con la mascota: el aviso al alojamiento lo da booking.
- Si `consultar-servicios-alojamiento` no dice nada de mascotas: booking lo pregunta al hotel.
- Si es un perro de asistencia: no lo trata como mascota y pasa la consulta a booking con `crear-ticket-booking`.

## Cómo lo puede pedir el cliente

- «¿Puedo llevar a mi perro al hotel?»
- «viajamos con un gato pequeñito, hay problema?»
- «O hotel aceita animais de estimação? Temos um cão pequeno.»
