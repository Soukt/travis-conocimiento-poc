---
caso: consulta-ya-abierta
pruebas:
  - pregunta: Os escribí la semana pasada por el reembolso y sigo sin respuesta.
    reserva: cancelada, con un ticket abierto sobre la devolución
    mercado: es
    esperado: Usa la plantilla de ticket duplicado, dice que la consulta sigue abierta y no crea otro ticket.
  - pregunta: Je vous ai déjà écrit pour changer mes dates, vous avez une réponse ?
    reserva: reembolsable, entrada dentro de 30 días, con un ticket abierto sobre el cambio de fechas
    mercado: fr
    esperado: Contesta en francés con la plantilla de ticket duplicado y no adelanta lo que decidirá booking.
  - pregunta: Ya os escribí por lo del hotel, pero es que estoy en la puerta y no me dejan entrar.
    reserva: hotel en curso, con un ticket abierto sobre la llegada
    mercado: es
    esperado: Ve que hay un hecho nuevo y urgente y crea un ticket para booking que cita el ticket abierto.
---
