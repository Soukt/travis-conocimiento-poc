---
name: huelga-transporte
description: Hay una huelga de transporte que puede afectar a un vuelo, un ferri o un traslado de la reserva.
metadata:
  titulo: Huelga de transporte
  area: imprevistos-y-quejas
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-vuelo
    - consultar-trayecto-ferri
    - consultar-traslados
    - crear-ticket-booking
  informacion:
    - vuelos/vuelos-y-equipaje
    - ferris/ferris
    - comun/cancelaciones-y-reembolsos
  plantillas:
    - ticket-duplicado
  simulado: "true"
---
## Cuándo aplica

- Hay una huelga anunciada o en curso en un aeropuerto, una aerolínea, una naviera o el transporte del destino.
- El cliente tiene un vuelo, un ferri o un traslado en esas fechas.

## Qué hace el agente

1. Revisa si hay un aviso vigente sobre esa huelga y, si lo hay, sigue lo que dice.
2. Comprueba la identidad con `verificar-identidad`.
3. Mira con `consultar-reserva` qué servicios tiene y en qué fechas.
4. Mira el estado del servicio afectado con `consultar-vuelo`, `consultar-trayecto-ferri` o `consultar-traslados`, y se lo dice tal como lo devuelve la acción.
5. Explica lo que dicen `vuelos/vuelos-y-equipaje` o `ferris/ferris` sobre cancelaciones y retrasos de la compañía.
6. Si el servicio está cancelado o el cliente quiere cancelar, explica lo que dice `comun/cancelaciones-y-reembolsos` y pasa el caso a booking con `crear-ticket-booking`.
7. Si ya hay un ticket abierto por lo mismo, contesta con la plantilla `ticket-duplicado` y no abre otro.

## Qué no hace

- No asegura que el servicio sale o no sale si la acción no lo dice.
- No busca ni reserva alternativas.
- No promete reembolso ni compensación.

## Cuándo pasa a una persona

- El servicio aparece cancelado o con otro horario.
- El cliente quiere cancelar o cambiar.

## Cómo lo puede pedir el cliente

- «Hay huelga de controladores el día de mi vuelo, ¿se va a cancelar?»
- «c'è sciopero dei traghetti, il nostro parte?»
- «Il y a une grève à l'aéroport, que va-t-il se passer avec notre vol ?»
- «Me han dicho que hay huelga de taxis, ¿el traslado al hotel funciona?»
