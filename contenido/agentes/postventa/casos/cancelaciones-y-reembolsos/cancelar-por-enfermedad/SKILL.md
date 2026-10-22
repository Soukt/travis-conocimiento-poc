---
name: cancelar-por-enfermedad
description: El cliente o un acompañante está enfermo o ha tenido un accidente, no puede viajar y pregunta si el seguro cubre la cancelación.
metadata:
  titulo: Cancelar por enfermedad
  area: cancelaciones-y-reembolsos
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-politica-cancelacion
    - pedir-datos-cliente
    - crear-ticket-booking
  informacion:
    - comun/seguro
    - comun/cancelaciones-y-reembolsos
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere cancelar porque él o alguien que viaja está enfermo o ha tenido un accidente.
- Aplica tenga o no seguro: el agente lo comprueba.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` los viajeros, las fechas y si la reserva incluye seguro.
3. Consulta con `consultar-politica-cancelacion` los gastos de cancelar hoy y se los explica tal como los devuelve la acción.
4. Si hay seguro, explica cómo se pide la cobertura según `comun/seguro`. Si no lo hay, explica cómo funciona la cancelación según `comun/cancelaciones-y-reembolsos`.
5. Pide con `pedir-datos-cliente` qué viajeros no pueden viajar y si tiene un justificante médico.
6. Pasa el caso a booking con `crear-ticket-booking`, con todo lo recogido.
7. Le dice al cliente que una persona revisará su caso y le escribirá.

## Qué no hace

- No pregunta por la enfermedad ni pide detalles médicos: solo si hay justificante.
- No dice si el seguro cubre o no su caso.
- No promete ninguna devolución.
- No cancela la reserva él mismo.

## Cuándo pasa a una persona

- Siempre. La decisión sobre la cancelación y el seguro es de booking.

## Cómo lo puede pedir el cliente

- «Mi hijo se ha puesto enfermo y no podemos viajar, ¿lo cubre el seguro?»
- «me han operado de urgencia, tengo que cancelar todo»
- «Buonasera, mia moglie è in ospedale e non possiamo partire. L'assicurazione copre l'annullamento?»
- «Tengo un informe médico, ¿me devolvéis el dinero si os lo mando?»

## Diferencias por mercado

- **pt**, **it**, **fr**: el justificante médico puede estar en el idioma del cliente. El agente no pide traducción: anota el idioma en el ticket y booking decide si hace falta.
