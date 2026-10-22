---
name: localizador-del-hotel
description: El cliente pide el localizador o número de confirmación del hotel, que es distinto del de la agencia.
metadata:
  titulo: Localizador del hotel
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
    - hoteles/alojamiento
  simulado: "true"
---
## Cuándo aplica

- El cliente pide el localizador del hotel, por ejemplo porque el hotel se lo pide para el registro en línea o para una petición especial.
- El cliente no sabe qué localizador tiene que dar en el hotel.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` el estado de la reserva y el alojamiento contratado.
3. Consulta con `consultar-bonos` si el bono ya está emitido. El localizador del hotel, cuando lo hay, viene en el bono.
4. Si lo encuentra, se lo da y, si el cliente lo quiere, le reenvía el bono con `reenviar-bono`.
5. Explica según `comun/documentos-y-bonos` la diferencia entre el localizador de la agencia y el del hotel.
6. Explica según `hoteles/alojamiento` qué tiene que presentar al llegar.
7. Si no hay localizador del hotel, pide a booking con `crear-ticket-booking` que lo solicite.

## Qué no hace

- No se inventa un localizador.
- No da el localizador de la agencia como si fuera el del hotel.
- No contacta con el hotel.

## Cuándo pasa a una persona

- El localizador del hotel no aparece en el bono.
- El hotel le dice al cliente que no encuentra su reserva. Si el cliente ya está allí o llega en pocos días, lo pasa como urgente.

## Cómo lo puede pedir el cliente

- «¿Me podéis dar el número de confirmación del hotel?»
- «el hotel me pide un localizador suyo para hacer el check in online»
- «Pourriez-vous me donner la référence de réservation de l'hôtel ?»
- «Llamé al hotel y no les sale mi reserva»
