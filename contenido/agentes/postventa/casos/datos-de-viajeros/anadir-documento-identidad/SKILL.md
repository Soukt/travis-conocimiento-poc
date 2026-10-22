---
name: anadir-documento-identidad
description: Falta el documento de identidad de algún viajero y el cliente quiere añadirlo, o la reserva se lo pide.
metadata:
  titulo: Añadir el documento de identidad
  area: datos-de-viajeros
  modo: autonomo
  acciones:
    - verificar-identidad
    - consultar-reserva
    - pedir-datos-cliente
    - crear-ticket-booking
  informacion:
    - comun/documentos-y-bonos
    - ferris/ferris
  plantillas:
    - pedir-datos-que-faltan
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere añadir el documento de identidad de uno o varios viajeros.
- Al cliente le han avisado de que faltan datos de viajeros, por ejemplo para un ferri, un vuelo o un circuito.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` qué viajeros y qué servicios hay, y qué datos faltan.
3. Explica según `comun/documentos-y-bonos` para qué se piden estos datos. Si hay ferri, añade lo que dice `ferris/ferris`.
4. Pide los datos que faltan con el formulario de `pedir-datos-cliente`, usando la plantilla `pedir-datos-que-faltan`.
5. Cuando el cliente los envía, se los pasa a booking con `crear-ticket-booking` para que los añada a la reserva, y le dice al cliente que booking los añadirá.

## Qué no hace

- No pide el número de documento por el chat: siempre con el formulario.
- No repite números de documento en sus mensajes.
- No da por añadidos los datos que no han llegado por el formulario.

## Cuándo pasa a una persona

- Cuando el cliente ha enviado el formulario, para que booking añada los datos.
- El documento de un viajero está caducado o caduca antes del viaje.

## Cómo lo puede pedir el cliente

- «Me piden el DNI de los niños para el ferri, ¿dónde lo pongo?»
- «falta el pasaporte de mi marido, os lo paso por aqui?»
- «Dove posso inserire i documenti dei passeggeri?»
- «Quiero añadir el número de documento de todos los viajeros.»
