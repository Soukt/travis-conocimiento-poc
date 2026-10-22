---
name: servicio-no-prestado
description: Un servicio contratado no se prestó o se prestó a medias (régimen, excursión, entrada o actividad) y el cliente reclama.
metadata:
  titulo: Un servicio que no se prestó
  area: imprevistos-y-quejas
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-servicios-alojamiento
    - pedir-datos-cliente
    - crear-ticket-booking
  informacion:
    - comun/cancelaciones-y-reembolsos
  plantillas:
    - derivado-a-booking
    - ticket-duplicado
  simulado: "true"
---
## Cuándo aplica

- Un servicio que el cliente tenía contratado no se le dio o se le dio a medias.
- El cliente reclama durante el viaje o después de volver.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` que el servicio está contratado y en qué fechas.
3. Si es un servicio del alojamiento, como el régimen o el spa, lo mira también con `consultar-servicios-alojamiento`.
4. Si el servicio no está en la reserva, se lo dice al cliente tal como lo devuelve la acción. Si aun así quiere reclamar, sigue.
5. Recoge con `pedir-datos-cliente` qué servicio falló, qué día, qué le dijeron allí y cualquier justificante.
6. Si pregunta por dinero, explica según `comun/cancelaciones-y-reembolsos` que cualquier devolución la estudia booking.
7. Pasa la reclamación a booking con `crear-ticket-booking` y contesta con la plantilla `derivado-a-booking`.
8. Si ya hay un ticket abierto por lo mismo, contesta con la plantilla `ticket-duplicado` y no abre otro.

## Qué no hace

- No reconoce que haya derecho a devolución ni da importes.
- No promete compensación.
- No discute con el cliente.

## Cuándo pasa a una persona

- Siempre: las reclamaciones las gestiona booking.

## Cómo lo puede pedir el cliente

- «Teníamos media pensión y no nos han dado las cenas.»
- «la excursion del martes no vino nadie a buscarnos y la perdimos»
- «O passeio que estava incluído foi cancelado e ninguém nos disse nada.»
- «Quiero reclamar, el spa estaba cerrado todos los días»

## Diferencias por mercado

- **es**: si el cliente pide la hoja de reclamaciones, el agente no la tramita. Lo indica en el ticket a booking como reclamación formal.
- **pt**: lo mismo si pide el «livro de reclamações».
