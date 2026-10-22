---
name: entradas-no-recibidas
description: El cliente no ha recibido las entradas del parque o no las encuentra.
metadata:
  titulo: No le han llegado las entradas
  area: parques-y-entradas
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-bonos
    - reenviar-bono
    - consultar-condiciones-entrada
    - crear-ticket-booking
  informacion:
    - comun/documentos-y-bonos
    - parques/parques-tematicos
  plantillas:
    - ticket-duplicado
  simulado: "true"
---
## Cuándo aplica

- El cliente tiene entradas a un parque, solas o dentro de un paquete, y no le han llegado.
- Le llegaron, pero no las encuentra.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` las entradas y la fecha de la visita.
3. Consulta con `consultar-bonos` si las entradas ya están emitidas.
4. Si lo están, las reenvía con `reenviar-bono` al email de la reserva y le pide que revise también el correo no deseado.
5. Si todavía no lo están, explica cuándo se envían según `comun/documentos-y-bonos` y `parques/parques-tematicos`.
6. Mira con `consultar-condiciones-entrada` si para entrar basta con el bono de la reserva o hacen falta las entradas del parque, y se lo dice.
7. Si la visita es en pocos días y las entradas no están emitidas, pasa el caso a booking con `crear-ticket-booking` como urgente.
8. Si ya hay un ticket abierto por lo mismo, contesta con la plantilla `ticket-duplicado` y no abre otro.

## Qué no hace

- No envía las entradas a un email distinto del de la reserva.
- No promete que llegarán antes de una fecha u hora concreta.
- No compra entradas nuevas ni ofrece otras.

## Cuándo pasa a una persona

- Las entradas deberían estar emitidas y no aparecen.
- La visita es en pocos días y las entradas no están.

## Cómo lo puede pedir el cliente

- «No me han llegado las entradas del parque.»
- «vamos al parque pasado mañana y no tengo nada!!»
- «Non trovo i biglietti del parco nella mail.»
