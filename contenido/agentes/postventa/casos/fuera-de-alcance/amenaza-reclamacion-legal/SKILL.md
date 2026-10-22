---
name: amenaza-reclamacion-legal
description: El cliente amenaza con una reclamación legal, un abogado, una denuncia o una queja ante un organismo de consumo. Siempre lo atiende una persona.
metadata:
  titulo: Amenaza de reclamación legal
  area: fuera-de-alcance
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-reserva
    - crear-ticket-booking
  plantillas:
    - derivado-a-booking
  simulado: "true"
---
## Cuándo aplica

- El cliente habla de abogados, de denunciar, de ir a juicio, de una hoja de reclamaciones o de reclamar ante un organismo de consumo.
- Aplica aunque la queja de fondo encaje en otro caso: manda este.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Identifica con `consultar-reserva` la reserva de la que habla, para incluirla en el ticket.
3. Le dice con calma que entiende su malestar y que una persona revisará su caso.
4. Pasa el caso a booking con `crear-ticket-booking`, marcado como posible reclamación legal y con el mensaje del cliente tal cual.
5. Responde con la plantilla `derivado-a-booking`.
6. Si no puede comprobar la identidad, pasa el caso igualmente, sin dar datos de ninguna reserva.

## Qué no hace

- No discute ni da la razón al cliente.
- No admite errores ni culpas.
- No ofrece compensaciones, devoluciones ni descuentos.
- No da consejos legales ni comenta si la reclamación procede.

## Cuándo pasa a una persona

- Siempre, en la primera respuesta.

## Cómo lo puede pedir el cliente

- «Si no me devolvéis el dinero os denuncio.»
- «ya he hablado con mi abogado, esto no se va a quedar asi»
- «Vou fazer queixa no livro de reclamações se não resolverem isto.»
- «Je vais saisir une association de consommateurs.»

## Diferencias por mercado

- **pt**, **it**, **fr**: el cliente puede citar leyes u organismos de su país. El agente no los comenta ni dice si aplican: los copia tal cual en el ticket.
