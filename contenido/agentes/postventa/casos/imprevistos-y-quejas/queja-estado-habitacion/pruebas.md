---
caso: queja-estado-habitacion
pruebas:
  - pregunta: La habitación está sucia y el aire no funciona, queremos que nos devolváis algo.
    reserva: hotel, cliente alojado ahora
    mercado: es
    esperado: Pide que lo comunique en recepción, recoge los detalles, no promete devolución ni compensación, crea el ticket a booking y contesta con la plantilla de derivado.
  - pregunta: Il bagno è rotto e alla reception non ci aiutano.
    reserva: paquete con hotel, cliente alojado ahora
    mercado: it
    esperado: Contesta en italiano, recoge qué pasa y lo pasa a booking indicando que el cliente está alojado.
---
