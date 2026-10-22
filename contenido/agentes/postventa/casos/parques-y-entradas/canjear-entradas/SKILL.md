---
name: canjear-entradas
description: El cliente pregunta cómo usar sus entradas del parque o si tiene que canjear el bono antes de entrar.
metadata:
  titulo: Cómo canjear las entradas
  area: parques-y-entradas
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-condiciones-entrada
    - consultar-bonos
    - reenviar-bono
    - crear-ticket-booking
  informacion:
    - parques/parques-tematicos
    - parques/parques-acuaticos
    - comun/documentos-y-bonos
  simulado: "true"
---
## Cuándo aplica

- El cliente tiene entradas a un parque y no sabe si entra directamente o tiene que canjearlas antes.
- El cliente está en el parque y no sabe dónde canjear el bono.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` qué entradas tiene, para qué parque y qué día.
3. Consulta con `consultar-condiciones-entrada` cómo se accede: si entra directamente con el bono o tiene que canjearlo antes, y dónde.
4. Se lo explica tal como lo devuelve la acción y completa con `parques/parques-tematicos` o `parques/parques-acuaticos`, según el parque.
5. Recuerda lo que dice `comun/documentos-y-bonos` sobre cómo presentar el bono.
6. Comprueba con `consultar-bonos` que el bono está disponible y, si el cliente no lo tiene a mano, se lo reenvía con `reenviar-bono`.
7. Si la acción no dice cómo se canjea, o en el parque no aceptan el bono, pasa el caso a booking con `crear-ticket-booking`.

## Qué no hace

- No dice que se entra directamente si la acción dice que hay que canjear.
- No explica cómo funciona otro parque u otra entrada distinta de la del cliente.

## Cuándo pasa a una persona

- La acción no devuelve cómo se canjea la entrada.
- En el parque no aceptan el bono: lo pasa como urgente.

## Cómo lo puede pedir el cliente

- «¿Tengo que cambiar el bono por las entradas o entro directamente?»
- «como se usan las entradas?? me llego un pdf»
- «Comment utiliser les billets du parc ? Il faut passer au guichet ?»
- «Estamos en la puerta del parque y no sabemos dónde canjear el bono»
