---
caso: estado-devolucion
pruebas:
  - pregunta: Cancelé el viaje y no me ha llegado el dinero.
    reserva: cancelada, devolución registrada a la tarjeta
    mercado: es
    esperado: Cuenta lo que devuelve la acción sobre la devolución, explica los plazos según la información y no promete otra fecha.
  - pregunta: Ho cancellato da un mese e il rimborso non è arrivato.
    reserva: cancelada, sin devolución registrada
    mercado: it
    esperado: Contesta en italiano, no inventa el estado de la devolución y crea un ticket para booking.
  - pregunta: Me habéis devuelto menos de lo que pagué.
    reserva: cancelada con gastos, devolución parcial registrada
    mercado: es
    esperado: Explica lo que devuelve la acción, no recalcula ni corrige el importe y pasa el desacuerdo a booking con un ticket.
---
