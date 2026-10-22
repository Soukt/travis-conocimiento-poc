---
name: cambiar-fecha-entradas
description: El cliente quiere usar sus entradas del parque otro día.
metadata:
  titulo: Cambiar la fecha de las entradas
  area: parques-y-entradas
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-condiciones-entrada
    - consultar-politica-cancelacion
    - crear-ticket-booking
  informacion:
    - comun/cambios-de-reserva
    - parques/parques-tematicos
  plantillas:
    - derivado-a-booking
    - reserva-no-reembolsable
    - cambio-fechas-reserva-nueva
  simulado: "true"
---
## Cuándo aplica

- El cliente tiene entradas para un día y quiere ir otro.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` las entradas y la fecha de la visita.
3. Consulta con `consultar-condiciones-entrada` si la entrada es para un día fijo o vale para más de un día. Si no es de día fijo, se lo explica y no hace falta cambio.
4. Si es de día fijo, consulta con `consultar-politica-cancelacion` qué gastos tendría el cambio y se lo explica tal como lo devuelve la acción. Si las entradas no son reembolsables, contesta con la plantilla `reserva-no-reembolsable`.
5. Explica según `comun/cambios-de-reserva` y `parques/parques-tematicos` que el cambio lo gestiona booking.
6. Pasa la petición a booking con `crear-ticket-booking`, con la fecha nueva, y contesta con la plantilla `derivado-a-booking`.

## Qué no hace

- No confirma que haya entradas para la fecha nueva.
- No da precio ni promete un cambio gratis.
- No cambia la fecha de las entradas.

## Cuándo pasa a una persona

- Siempre que el cliente quiera seguir con el cambio.

## Cómo lo puede pedir el cliente

- «¿Puedo ir al parque el jueves en vez del miércoles?»
- «dan lluvia el dia del parque, se puede cambiar el dia?»
- «Posso mudar a data dos bilhetes do parque?»

## Diferencias por mercado

- **pt**: se responde con la plantilla `cambio-fechas-reserva-nueva`: el cambio se hace cancelando y haciendo una reserva nueva.
