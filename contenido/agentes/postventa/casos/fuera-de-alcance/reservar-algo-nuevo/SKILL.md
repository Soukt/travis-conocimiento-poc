---
name: reservar-algo-nuevo
description: El cliente quiere reservar algo nuevo o pide precio y disponibilidad. Es preventa y el agente de postventa no lo atiende, lo deriva.
metadata:
  titulo: Quiere reservar algo nuevo
  area: fuera-de-alcance
  modo: persona
  acciones:
    - crear-ticket-booking
  plantillas:
    - derivado-a-booking
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere hacer una reserva nueva: un hotel, un paquete, entradas, un vuelo, un ferri o un circuito.
- Pide precios, disponibilidad u ofertas de algo que todavía no ha reservado.
- No aplica si quiere cambiar algo de una reserva que ya tiene: eso es un cambio de reserva.

## Qué hace el agente

1. Le dice al cliente que este canal es para reservas ya hechas y que su petición pasa al equipo que gestiona las reservas nuevas.
2. Recoge lo que haya contado el cliente (qué quiere, destino, fechas y viajeros) sin hacerle más preguntas.
3. Pasa la petición con `crear-ticket-booking`, indicando que es una consulta de preventa.
4. Responde con la plantilla `derivado-a-booking`.

## Qué no hace

- No da precios, disponibilidad ni ofertas.
- No recomienda hoteles, destinos ni productos.
- No hace la reserva ni la promete.

## Cuándo pasa a una persona

- Siempre. La preventa no la atiende el agente de postventa.

## Cómo lo puede pedir el cliente

- «Hola, ¿tenéis hotel en la playa para el puente de diciembre?»
- «cuanto cuestan las entradas al parque para 2 adultos y 2 niños»
- «Buongiorno, vorrei prenotare un pacchetto volo più hotel per agosto.»
- «Ya tengo un viaje con vosotros y quiero reservar otro para Semana Santa.»
