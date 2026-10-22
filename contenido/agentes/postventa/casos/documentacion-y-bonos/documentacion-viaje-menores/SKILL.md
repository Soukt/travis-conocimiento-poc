---
name: documentacion-viaje-menores
description: El cliente pregunta qué documentos necesita un menor para viajar, con sus padres, con uno solo de ellos o con otros adultos.
metadata:
  titulo: Documentación para viajar con menores
  area: documentacion-y-bonos
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - buscar-informacion
    - crear-ticket-booking
  informacion:
    - comun/documentos-y-bonos
    - vuelos/vuelos-y-equipaje
  simulado: "true"
---
## Cuándo aplica

- En la reserva viaja algún menor y el cliente pregunta qué documentación necesita.
- El menor viaja sin sus padres o con uno solo de ellos.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` el destino, los servicios contratados y las edades de los viajeros.
3. Explica lo que dice `comun/documentos-y-bonos` sobre la documentación de menores.
4. Si hay vuelo, añade lo que dice `vuelos/vuelos-y-equipaje` sobre menores.
5. Si el cliente pregunta algo que no está ahí, lo busca con `buscar-informacion`.
6. Recuerda que la documentación la exigen las autoridades y la compañía de transporte, y que conviene confirmarla con ellas antes de viajar.
7. Si no hay respuesta aprobada, pasa la duda a booking con `crear-ticket-booking`.

## Qué no hace

- No asegura que un documento concreto sea suficiente si la información aprobada no lo dice.
- No tramita permisos ni autorizaciones de viaje.
- No da consejos legales sobre custodia o permisos de los padres.

## Cuándo pasa a una persona

- La pregunta no tiene respuesta aprobada.
- El menor no tiene documento en vigor y el viaje es pronto.

## Cómo lo puede pedir el cliente

- «¿Mi hijo de 8 años necesita DNI para el vuelo?»
- «viajo sola con mi hija, necesito algun papel del padre?»
- «Mio nipote di 15 anni viaggia con noi, che documenti servono?»
- «Mon fils voyage sans nous avec ses grands-parents, quels documents faut-il ?»

## Diferencias por mercado

- **es**, **pt**, **it**, **fr**: los permisos para un menor que viaja sin sus padres dependen del país que emite su documento. El agente usa solo la respuesta aprobada para el mercado del cliente. Si no la hay, lo pasa a booking.
