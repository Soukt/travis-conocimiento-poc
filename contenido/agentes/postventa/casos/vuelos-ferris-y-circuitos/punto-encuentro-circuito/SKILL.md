---
name: punto-encuentro-circuito
description: El cliente pregunta dónde y a qué hora empieza su circuito o dónde se encuentra con el guía.
metadata:
  titulo: Punto de encuentro del circuito
  area: vuelos-ferris-y-circuitos
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-traslados
    - consultar-bonos
    - reenviar-bono
    - crear-ticket-booking
  informacion:
    - circuitos/circuitos
    - comun/documentos-y-bonos
  simulado: "true"
---
## Cuándo aplica

- El cliente tiene un circuito reservado.
- Pregunta por el punto de encuentro, la hora de salida o cómo encontrar al guía.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` el circuito, la fecha de inicio y, si aparece, el idioma del guía.
3. Mira con `consultar-traslados` el punto y la hora de encuentro, y si hay traslado incluido hasta allí.
4. Se lo dice tal como lo devuelve la acción.
5. Para dudas generales, como qué llevar o cómo es el primer día, responde según `circuitos/circuitos`.
6. Le recuerda que lleve el bono según `comun/documentos-y-bonos`. Si no lo tiene, mira con `consultar-bonos` si está disponible y lo reenvía con `reenviar-bono`.

## Qué no hace

- No da un punto ni una hora de encuentro que no venga de la acción.
- No busca direcciones por su cuenta.
- No promete un guía en el idioma del cliente.

## Cuándo pasa a una persona

Crea un ticket con `crear-ticket-booking` si:

- `consultar-traslados` no devuelve el punto o la hora de encuentro.
- El bono no está disponible.
- El circuito ya ha empezado y el cliente no encuentra al guía.

## Cómo lo puede pedir el cliente

- «¿Dónde quedamos con el guía el primer día del circuito?»
- «a que hora sale el bus del circuito y desde donde»
- «Olá, onde é o ponto de encontro do circuito?»

## Diferencias por mercado

- **pt**, **it**, **fr**: el guía puede no hablar el idioma del cliente. Si `consultar-reserva` muestra el idioma del guía, se lo dice; si no lo muestra, no lo da por hecho y no promete otro.
