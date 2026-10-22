---
name: regimen-incluido
description: El cliente pregunta qué régimen de comidas tiene su reserva y qué entra en él.
metadata:
  titulo: Qué régimen incluye
  area: que-incluye-la-reserva
  modo: autonomo
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

- El cliente quiere saber si tiene desayuno, media pensión, pensión completa o todo incluido.
- El cliente pregunta qué entra en su régimen, como bebidas o cenas.
- No aplica si quiere cambiar de régimen: eso es un cambio de la reserva.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` el régimen contratado y se lo dice tal como lo devuelve la acción.
3. Si pregunta qué entra exactamente, mira con `consultar-servicios-alojamiento` lo que diga el alojamiento y se lo cuenta tal cual.
4. Si eso no aparece, no lo da por hecho, según `hoteles/alojamiento`.

## Qué no hace

- No promete bebidas, comidas ni horarios del comedor que no devuelvan las acciones.
- No cambia el régimen.

## Cuándo pasa a una persona

- Si lo que pregunta no aparece y es importante para el cliente: pasa la consulta a booking con `crear-ticket-booking` para que lo pregunte al hotel.
- Si el régimen que devuelve `consultar-reserva` no coincide con lo que el cliente dice que compró.

## Cómo lo puede pedir el cliente

- «¿Mi reserva tiene el desayuno incluido?»
- «tenemos media pension o completa? no me acuerdo»
- «La cena è inclusa nel nostro pacchetto?»

## Diferencias por mercado

- **pt**, **it** y **fr**: el régimen se nombra como se dice en el país del cliente (por ejemplo, «meia pensão», «mezza pensione» o «demi-pension») y no se dejan las siglas en español (SA, AD, MP, PC, TI) sin explicar.
