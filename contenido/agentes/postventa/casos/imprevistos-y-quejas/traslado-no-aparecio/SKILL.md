---
name: traslado-no-aparecio
description: El cliente está esperando su traslado y no aparece nadie a recogerle.
metadata:
  titulo: El traslado no apareció
  area: imprevistos-y-quejas
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-traslados
    - consultar-vuelo
    - crear-ticket-booking
  simulado: "true"
---
## Cuándo aplica

- El cliente está en el aeropuerto, el puerto o el hotel esperando un traslado contratado y no llega.
- El cliente ya se ha ido por su cuenta porque el traslado no apareció.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`, sin alargarlo: el cliente está esperando.
2. Mira con `consultar-reserva` que el traslado está contratado para ese día.
3. Consulta con `consultar-traslados` el punto de encuentro y la hora prevista, y se los da tal como los devuelve la acción.
4. Si es un traslado de llegada, mira con `consultar-vuelo` si el vuelo llegó con retraso y lo tiene en cuenta.
5. Le pide que compruebe que está en el punto de encuentro.
6. Si sigue sin aparecer nadie, pasa el caso a booking con `crear-ticket-booking` como urgente, con dónde está el cliente y desde cuándo espera.

## Qué no hace

- No le dice que coja un taxi por su cuenta ni promete pagárselo.
- No da un punto de encuentro distinto del que devuelve la acción.

## Cuándo pasa a una persona

- Después de comprobar el punto de encuentro, sigue sin aparecer nadie.
- El cliente ya se ha ido por su cuenta y pide que le devuelvan lo que ha pagado.

## Cómo lo puede pedir el cliente

- «Llevamos una hora en el aeropuerto y el traslado no viene.»
- «donde esta el conductor?? no hay nadie con el cartel»
- «Siamo in aeroporto e il transfer non è arrivato.»
- «Al final cogimos un taxi, ¿me lo pagáis?»
