---
name: hora-presentacion-puerto
description: El cliente pregunta a qué hora tiene que estar en el puerto y desde dónde sale su trayecto en ferri.
metadata:
  titulo: A qué hora presentarse en el puerto
  area: vuelos-ferris-y-circuitos
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-trayecto-ferri
    - consultar-bonos
    - reenviar-bono
    - crear-ticket-booking
  informacion:
    - ferris/ferris
    - comun/documentos-y-bonos
  simulado: "true"
---
## Cuándo aplica

- El cliente tiene un trayecto en ferri reservado.
- Pregunta a qué hora presentarse, de qué puerto sale o qué necesita para embarcar.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-trayecto-ferri` el puerto, la hora de presentación y la hora de embarque.
3. Se lo dice tal como lo devuelve la acción, separando la hora de presentación de la hora de salida.
4. Explica qué documentos tiene que llevar según `comun/documentos-y-bonos` y las dudas del embarque según `ferris/ferris`.
5. Si el cliente no tiene el bono, mira con `consultar-bonos` si está disponible y lo reenvía con `reenviar-bono`.

## Qué no hace

- No calcula ni redondea la hora de presentación.
- No da indicaciones para llegar al puerto que no estén en la información.
- No cambia la hora ni el trayecto.

## Cuándo pasa a una persona

Crea un ticket con `crear-ticket-booking` si:

- `consultar-trayecto-ferri` no devuelve el puerto o la hora de presentación.
- El bono no está disponible.
- El cliente avisa de que no va a llegar a tiempo al embarque.

## Cómo lo puede pedir el cliente

- «¿A qué hora tengo que estar en el puerto?»
- «el ferry sale a las 9, con cuanto tiempo antes hay que ir?»
- «A che ora devo presentarmi al porto per l'imbarco?»
- «¿Desde qué puerto sale mi barco?»
