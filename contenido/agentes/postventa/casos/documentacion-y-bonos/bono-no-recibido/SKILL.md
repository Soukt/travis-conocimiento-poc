---
name: bono-no-recibido
description: El cliente dice que no le ha llegado el bono de su reserva o que no lo encuentra.
metadata:
  titulo: No ha recibido el bono
  area: documentacion-y-bonos
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-bonos
    - reenviar-bono
    - crear-ticket-booking
  informacion:
    - comun/documentos-y-bonos
  plantillas:
    - ticket-duplicado
  simulado: "true"
---
## Cuándo aplica

- El cliente no ha recibido el bono de una reserva confirmada.
- El cliente lo recibió, pero lo ha borrado o no lo encuentra.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` que la reserva está confirmada y qué servicios tiene.
3. Consulta con `consultar-bonos` si los bonos ya están disponibles.
4. Si están disponibles, los reenvía con `reenviar-bono` al email de la reserva y le pide que revise también el correo no deseado.
5. Si todavía no están disponibles, explica cuándo se envían según `comun/documentos-y-bonos`.
6. Si el bono debería estar disponible y no lo está, o el reenvío no llega, pasa el caso a booking con `crear-ticket-booking`.
7. Si ya hay un ticket abierto por lo mismo, contesta con la plantilla `ticket-duplicado` y no abre otro.

## Qué no hace

- No envía el bono a un email distinto del de la reserva.
- No promete una fecha de envío que no venga de la acción o de la información aprobada.
- No da datos del bono de memoria.

## Cuándo pasa a una persona

- El bono debería estar emitido y no aparece.
- El cliente sigue sin recibirlo después del reenvío.
- La reserva no está confirmada: se trata como una reserva pendiente de confirmar.

## Cómo lo puede pedir el cliente

- «No me ha llegado el bono del hotel.»
- «hola, pague hace dos dias y no me a llegado nada al correo»
- «Non ho ricevuto il voucher della prenotazione, potete rimandarlo?»
- «He borrado sin querer el email con los bonos, ¿me lo mandáis otra vez?»
