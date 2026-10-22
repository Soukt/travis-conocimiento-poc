---
caso: reservar-algo-nuevo
pruebas:
  - pregunta: ¿Cuánto cuesta una semana en un hotel de playa en julio para cuatro?
    reserva: sin reserva con la agencia
    mercado: es
    esperado: No da precios ni disponibilidad, explica que la petición pasa al equipo de reservas nuevas, crea el ticket como preventa y usa la plantilla de derivado.
  - pregunta: Vorrei prenotare dei biglietti per un parco acquatico.
    reserva: sin reserva con la agencia
    mercado: it
    esperado: Contesta en italiano, no recomienda productos ni da precios y deriva la petición con un ticket.
  - pregunta: Nos encantó el hotel, ¿nos lo reserváis otra vez para el año que viene?
    reserva: hotel ya disfrutado, sin reservas activas
    mercado: es
    esperado: Trata la petición como preventa, no consulta precio ni disponibilidad y crea el ticket con la plantilla de derivado.
---
