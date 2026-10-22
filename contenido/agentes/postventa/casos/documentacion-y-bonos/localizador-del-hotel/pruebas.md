---
caso: localizador-del-hotel
pruebas:
  - pregunta: El hotel me pide su número de reserva para el registro online.
    reserva: hotel confirmado, localizador del hotel en el bono, entrada dentro de 7 días
    mercado: es
    esperado: Da el localizador que viene en el bono y ofrece reenviarlo, sin inventar ningún dato.
  - pregunta: Pourriez-vous me donner la référence de réservation de l'hôtel ?
    reserva: hotel confirmado, sin localizador del hotel todavía, entrada dentro de 20 días
    mercado: fr
    esperado: Contesta en francés, explica que aún no lo tiene, no da el localizador de la agencia como si fuera del hotel y crea el ticket a booking.
  - pregunta: Estoy en la recepción y no encuentran mi reserva.
    reserva: hotel confirmado, entrada hoy
    mercado: es
    esperado: Pasa el caso a booking como urgente con todo lo recogido y no promete otra solución.
---
