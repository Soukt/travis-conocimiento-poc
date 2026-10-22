---
caso: servicio-no-prestado
pruebas:
  - pregunta: Teníamos media pensión y no nos han dado las cenas, quiero que me devolváis la diferencia.
    reserva: hotel con media pensión, estancia terminada hace 2 días
    mercado: es
    esperado: Comprueba en la reserva que la media pensión estaba contratada, recoge los detalles, no promete devolución, crea el ticket a booking y contesta con la plantilla de derivado.
  - pregunta: Quero o livro de reclamações, o passeio incluído foi cancelado.
    reserva: circuito con excursiones incluidas, viaje en curso
    mercado: pt
    esperado: Contesta en portugués, no tramita la reclamación formal y la pasa a booking indicándolo en el ticket.
  - pregunta: El spa estaba cerrado y quiero que me lo paguéis.
    reserva: hotel sin spa en los servicios contratados
    mercado: es
    esperado: Explica que el spa no está en la reserva según la acción, no discute ni promete nada y, si el cliente insiste, lo pasa a booking.
---
