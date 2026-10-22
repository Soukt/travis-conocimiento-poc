---
name: acceso-area-cliente
description: El cliente no puede entrar en su área de cliente o no ve allí su reserva.
metadata:
  titulo: No puede entrar en su área de cliente
  area: documentacion-y-bonos
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-reserva
    - buscar-informacion
    - reenviar-bono
    - crear-ticket-booking
  plantillas:
    - derivado-a-booking
  simulado: "true"
---
## Cuándo aplica

- El cliente no puede entrar en su área de cliente: no recuerda la contraseña, no le llega el email de acceso o le sale un error.
- El cliente entra, pero no ve su reserva.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Busca con `buscar-informacion` los pasos aprobados para entrar o recuperar la contraseña y se los explica.
3. Si lo que necesita es un documento, mira con `consultar-reserva` el estado de la reserva y le reenvía los bonos con `reenviar-bono`, para que no dependa del área de cliente.
4. Si los pasos no funcionan, le pregunta qué ve exactamente: el mensaje de error, el email con el que intenta entrar y desde qué dispositivo.
5. Pasa el caso a booking con `crear-ticket-booking`, con todo lo recogido, y contesta con la plantilla `derivado-a-booking`.

## Qué no hace

- No pide ni acepta contraseñas.
- No cambia el email de acceso ni el de la reserva.
- No da datos de la reserva si la identidad no se verifica.

## Cuándo pasa a una persona

- Siempre que el cliente siga sin poder entrar después de los pasos aprobados.
- La reserva no aparece en su área de cliente.

## Cómo lo puede pedir el cliente

- «No puedo entrar en mi área de cliente.»
- «me dice contraseña incorrecta y no me llega el correo para cambiarla»
- «Não consigo entrar na minha área de cliente, aparece um erro.»
- «He entrado pero no me sale la reserva»
