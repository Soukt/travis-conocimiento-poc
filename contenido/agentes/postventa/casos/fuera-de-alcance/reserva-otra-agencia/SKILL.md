---
name: reserva-otra-agencia
description: El cliente pregunta por una reserva que no está con la agencia porque la hizo en otra agencia o directamente con el hotel, la aerolínea o la naviera.
metadata:
  titulo: Reserva hecha en otra agencia
  area: fuera-de-alcance
  modo: copiloto
  acciones:
    - pedir-datos-cliente
    - verificar-identidad
    - crear-ticket-booking
  plantillas:
    - pedir-datos-que-faltan
  simulado: "true"
---
## Cuándo aplica

- `verificar-identidad` no encuentra ninguna reserva con el localizador y el email que da el cliente.
- O el cliente dice que reservó en otra web, en otra agencia o directamente con el hotel, la aerolínea o la naviera.

## Qué hace el agente

1. Si faltan datos, pide el localizador y el email de la reserva con `pedir-datos-cliente` y la plantilla `pedir-datos-que-faltan`.
2. Comprueba con `verificar-identidad` si hay una reserva con esos datos.
3. Si no la encuentra, le pide que revise el email de confirmación para ver con quién reservó y que compruebe que el localizador está bien escrito.
4. Si el cliente confirma que reservó en otro sitio, le explica con amabilidad que no puede ver ni gestionar esa reserva y que tiene que hablar con quien se la vendió.

## Qué no hace

- No da datos de contacto de otras empresas.
- No opina sobre la reserva ni sobre la otra empresa.
- No ofrece repetir la reserva con la agencia: eso es preventa.

## Cuándo pasa a una persona

Crea un ticket con `crear-ticket-booking` si:

- El cliente insiste en que reservó con la agencia y la reserva no aparece.
- El cliente tiene un cobro de la agencia y no aparece ninguna reserva.

## Cómo lo puede pedir el cliente

- «Hola, tengo una reserva para el ferri y no sé si fue con vosotros.»
- «no encuentro mi reserva en vuestra web, la hice por otra pagina creo»
- «Bonjour, j'ai réservé l'hôtel sur un autre site, vous pouvez m'aider ?»
- «Me habéis cobrado pero la reserva la hice con el hotel directamente.»
