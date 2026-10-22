---
name: alerta-meteorologica-destino
description: Hay o se anuncia mal tiempo en el destino y el cliente pregunta si su viaje sigue adelante o qué puede hacer.
metadata:
  titulo: Alerta meteorológica en destino
  area: imprevistos-y-quejas
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-vuelo
    - consultar-trayecto-ferri
    - consultar-politica-cancelacion
    - crear-ticket-booking
  informacion:
    - comun/cancelaciones-y-reembolsos
    - comun/seguro
  simulado: "true"
---
## Cuándo aplica

- Hay una alerta por tormenta, temporal, nieve o calor en el destino y el viaje del cliente está a punto de empezar o en curso.

## Qué hace el agente

1. Revisa si hay un aviso vigente para ese destino o esas fechas y, si lo hay, sigue lo que dice.
2. Comprueba la identidad con `verificar-identidad`.
3. Mira con `consultar-reserva` los servicios contratados y sus fechas.
4. Si hay vuelo o ferri, mira su estado con `consultar-vuelo` o `consultar-trayecto-ferri` y se lo dice tal como lo devuelve la acción.
5. Si el cliente quiere cancelar o cambiar, consulta los gastos con `consultar-politica-cancelacion` y explica lo que dice `comun/cancelaciones-y-reembolsos`.
6. Si la reserva tiene seguro, explica lo que dice `comun/seguro`.
7. Si un servicio aparece cancelado o el cliente quiere cancelar o cambiar, pasa el caso a booking con `crear-ticket-booking`.

## Qué no hace

- No da previsiones del tiempo ni dice si es seguro viajar.
- No da un servicio por cancelado si la acción no lo dice.
- No promete devolución ni cambio sin gastos por el mal tiempo.

## Cuándo pasa a una persona

- Un vuelo, un ferri u otro servicio aparece cancelado.
- El cliente quiere cancelar o cambiar el viaje.

## Cómo lo puede pedir el cliente

- «Han puesto alerta roja por tormenta en el destino, ¿qué hacemos?»
- «sale el ferri con este temporal???»
- «Há um alerta de tempestade, o nosso voo vai sair?»
- «Si no podemos viajar por el tiempo, ¿nos devolvéis el dinero?»
