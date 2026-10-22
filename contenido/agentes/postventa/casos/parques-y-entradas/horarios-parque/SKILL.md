---
name: horarios-parque
description: El cliente pregunta a qué hora abre o cierra el parque el día de su visita.
metadata:
  titulo: Horarios del parque
  area: parques-y-entradas
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-condiciones-entrada
    - buscar-informacion
    - crear-ticket-booking
  informacion:
    - parques/parques-tematicos
    - parques/parques-acuaticos
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere saber el horario del parque para el día de sus entradas.
- El cliente pregunta si su entrada tiene una hora fija de acceso.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` el parque y la fecha de la visita.
3. Consulta con `consultar-condiciones-entrada` el horario de ese día y si la entrada tiene una hora de acceso.
4. Si la acción no lo devuelve, lo busca con `buscar-informacion`.
5. Completa con lo que digan `parques/parques-tematicos` o `parques/parques-acuaticos` sobre horarios.
6. Si no encuentra el horario, lo dice claramente y no da uno aproximado.
7. Si el cliente dice que el parque está cerrado el día de su entrada, pasa el caso a booking con `crear-ticket-booking`.

## Qué no hace

- No da horarios de memoria ni los de otro día.
- No da horarios de espectáculos o atracciones si la acción no los devuelve.

## Cuándo pasa a una persona

- Normalmente no pasa: si no hay horario, lo dice.
- El parque está cerrado el día de la entrada del cliente.

## Cómo lo puede pedir el cliente

- «¿A qué hora abre el parque el sábado?»
- «hasta q hora esta abierto el parque acuatico?»
- «A que horas abre o parque no dia da nossa visita?»
