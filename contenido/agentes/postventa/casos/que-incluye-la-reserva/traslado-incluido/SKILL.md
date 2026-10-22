---
name: traslado-incluido
description: El cliente pregunta si su reserva incluye el traslado entre el aeropuerto, el puerto o la estación y el alojamiento, y cómo funciona.
metadata:
  titulo: Si incluye traslado
  area: que-incluye-la-reserva
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-traslados
    - consultar-bonos
    - reenviar-bono
    - crear-ticket-booking
  informacion:
    - comun/documentos-y-bonos
    - vuelos/vuelos-y-equipaje
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere saber si tiene traslado incluido y dónde le recogen.
- El cliente pregunta a qué hora sale el traslado de vuelta.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` los servicios contratados. Si no hay traslado, se lo dice claramente.
3. Si hay traslado, mira con `consultar-traslados` el punto de encuentro y los horarios, y se los dice tal como los devuelve la acción.
4. Le explica según `comun/documentos-y-bonos` que tiene que llevar el bono. Si no lo tiene, mira con `consultar-bonos` si está disponible y se lo reenvía con `reenviar-bono`.

## Qué no hace

- No añade un traslado a la reserva ni da su precio.
- No da horarios ni puntos de encuentro que no devuelva `consultar-traslados`.

## Cuándo pasa a una persona

- Si no tiene traslado y quiere contratarlo: pasa la petición a booking con `crear-ticket-booking`.
- Si la aerolínea ha cambiado el horario del vuelo y afecta al traslado: lo revisa booking, según `vuelos/vuelos-y-equipaje`, y lo pasa con `crear-ticket-booking`, con el horario nuevo.
- Si está en destino y el traslado no ha aparecido.

## Cómo lo puede pedir el cliente

- «¿El paquete incluye el traslado del aeropuerto al hotel?»
- «donde nos recoge el transfer al llegar?»
- «Il transfer dall'aeroporto è compreso?»
