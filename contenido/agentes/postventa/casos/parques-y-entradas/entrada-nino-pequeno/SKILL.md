---
name: entrada-nino-pequeno
description: El cliente pregunta si un niño pequeño necesita entrada para el parque o cómo se acredita su edad.
metadata:
  titulo: Entrada para un niño pequeño
  area: parques-y-entradas
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-condiciones-entrada
    - crear-ticket-booking
  informacion:
    - parques/parques-tematicos
    - parques/parques-acuaticos
  simulado: "true"
---
## Cuándo aplica

- Viaja un niño pequeño y el cliente no sabe si necesita entrada.
- El cliente duda de si la entrada del niño es del tipo que le toca por edad.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` los viajeros, sus edades y las entradas compradas.
3. Consulta con `consultar-condiciones-entrada` las edades de cada tipo de entrada y si el parque pide algún documento para acreditar la edad.
4. Se lo explica tal como lo devuelve la acción y completa con `parques/parques-tematicos` o `parques/parques-acuaticos`, según el parque.
5. Si el niño necesita una entrada que no está en la reserva, o la que tiene no le corresponde, pasa la petición a booking con `crear-ticket-booking`.

## Qué no hace

- No dice que el niño entra gratis si la acción no lo dice.
- No añade entradas ni da precios.
- No anima a ir sin entrada para probar suerte.

## Cuándo pasa a una persona

- Hay que añadir o cambiar una entrada.

## Cómo lo puede pedir el cliente

- «Mi hija tiene 2 años, ¿paga entrada?»
- «el bebe necesita entrada o entra gratis?»
- «Il bambino ha 3 anni, serve il biglietto per il parco acquatico?»
- «Compramos entrada infantil pero mi hijo ya ha cumplido años, ¿pasa algo?»
