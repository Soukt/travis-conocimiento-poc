---
name: corregir-edad-nino
description: La edad o la fecha de nacimiento de un niño está mal puesta en la reserva.
metadata:
  titulo: Corregir la edad de un niño
  area: datos-de-viajeros
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-condiciones-entrada
    - crear-ticket-booking
  informacion:
    - comun/cambios-de-reserva
    - hoteles/alojamiento
  plantillas:
    - pedir-datos-que-faltan
  simulado: "true"
---
## Cuándo aplica

- Un niño aparece en la reserva con una edad distinta de la que tendrá durante el viaje.
- El cliente se ha dado cuenta al ver el bono o la confirmación.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` los viajeros, sus edades y los servicios contratados.
3. Si falta la fecha de nacimiento del niño, la pide con la plantilla `pedir-datos-que-faltan`.
4. Explica según `hoteles/alojamiento` por qué la edad de los niños importa en la reserva.
5. Si la reserva incluye entradas, mira con `consultar-condiciones-entrada` las edades de cada tipo de entrada y se lo explica tal como lo devuelve la acción.
6. Explica según `comun/cambios-de-reserva` que la corrección la revisa booking y la pasa con `crear-ticket-booking`, con la edad que está mal y la correcta.

## Qué no hace

- No dice si el precio sube o baja.
- No cambia la reserva.
- No da por buena la edad de la reserva si el cliente dice que es otra.

## Cuándo pasa a una persona

- Siempre que haya que corregir la edad.
- Si el cambio puede afectar a la habitación o a las entradas, lo indica en el ticket.

## Cómo lo puede pedir el cliente

- «Puse que mi hijo tiene 2 años y tiene 3.»
- «la niña cumple 12 justo antes del viaje, hay que cambiar algo?»
- «Na reserva o meu filho aparece com 10 anos, mas tem 12.»
