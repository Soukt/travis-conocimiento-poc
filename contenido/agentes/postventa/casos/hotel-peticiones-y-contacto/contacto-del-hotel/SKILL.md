---
name: contacto-del-hotel
description: El cliente pide el teléfono, el email o la dirección del alojamiento de su reserva para hablar directamente con él.
metadata:
  titulo: Contacto del hotel
  area: hotel-peticiones-y-contacto
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-bonos
    - reenviar-bono
    - crear-ticket-booking
  informacion:
    - hoteles/alojamiento
    - comun/documentos-y-bonos
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere el teléfono, el email o la dirección del alojamiento de su reserva.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` qué alojamiento tiene reservado.
3. Pregunta para qué necesita contactar. Si es para avisar de una llegada tarde o hacer una petición para la habitación, el aparcamiento o una celebración, le ofrece gestionarlo desde aquí con el caso de esa petición.
4. Le explica según `hoteles/alojamiento` que los datos de contacto del hotel vienen en el bono.
5. Mira con `consultar-bonos` si el bono está disponible y se lo reenvía con `reenviar-bono`. Le recuerda según `comun/documentos-y-bonos` que llega al email de la reserva.

## Qué no hace

- No da teléfonos, emails ni direcciones de memoria ni sacados de fuera de nuestros sistemas.
- No reenvía el bono a otro email.
- No llama él al alojamiento.

## Cuándo pasa a una persona

- Si el bono no está disponible según `consultar-bonos`: pasa la consulta a booking con `crear-ticket-booking`.
- Si el cliente no consigue hablar con el hotel: booking lo contacta por él, y lo pasa con `crear-ticket-booking`, con lo que necesita.

## Cómo lo puede pedir el cliente

- «¿Me pueden dar el teléfono del hotel?»
- «necesito el mail del hotel para preguntarles una cosa»
- «Qual é o contacto do hotel? Quero falar com a receção.»
