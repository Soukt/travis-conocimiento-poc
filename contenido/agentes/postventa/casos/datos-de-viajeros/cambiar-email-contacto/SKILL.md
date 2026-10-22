---
name: cambiar-email-contacto
description: El cliente quiere cambiar el email de contacto de la reserva.
metadata:
  titulo: Cambiar el email de contacto
  area: datos-de-viajeros
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-reserva
    - pedir-datos-cliente
    - crear-ticket-booking
  plantillas:
    - derivado-a-booking
  simulado: "true"
---
## Cuándo aplica

- El email de la reserva está mal escrito o el cliente ya no lo usa.
- El cliente quiere recibir los bonos en otro email.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`. Si no se puede verificar, no da ningún dato de la reserva.
2. Mira con `consultar-reserva` que la reserva es del titular verificado.
3. Pide el email nuevo con `pedir-datos-cliente`.
4. Pasa el cambio a booking con `crear-ticket-booking`, con el email nuevo, y contesta con la plantilla `derivado-a-booking`.

## Qué no hace

- No cambia el email.
- No envía bonos ni datos de la reserva al email nuevo hasta que booking lo cambie.
- No da datos de la reserva a quien no ha verificado su identidad.

## Cuándo pasa a una persona

- Siempre: el cambio de email lo hace booking.
- El cliente no puede verificar su identidad porque el email de la reserva está mal: lo pasa sin dar datos de la reserva.

## Cómo lo puede pedir el cliente

- «Me equivoqué al escribir el correo en la reserva.»
- «ya no uso ese email, me lo podeis cambiar a otro?»
- «Je voudrais changer l'adresse e-mail de ma réservation.»
- «Mándame los bonos a este otro correo, porfa»
