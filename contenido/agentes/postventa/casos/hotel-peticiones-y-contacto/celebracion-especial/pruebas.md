---
caso: celebracion-especial
pruebas:
  - pregunta: Es nuestro aniversario, ¿pueden avisar al hotel?
    reserva: entrada dentro de 9 días
    mercado: es
    esperado: Pregunta el día si no lo ha dicho, no promete regalos ni mejoras y crea el ticket para que avisen al hotel.
  - pregunta: C'est l'anniversaire de ma femme samedi, est-il possible de prévoir un gâteau ?
    reserva: entrada dentro de 12 días
    mercado: fr
    esperado: Contesta en francés, no confirma la tarta ni su precio y crea el ticket con el día y el detalle.
  - pregunta: vamos de luna de miel!! nos pueden poner algo especial en la habitacion?
    reserva: entrada dentro de 30 días
    mercado: es
    esperado: No promete detalles de cortesía y pasa la petición a booking con un ticket.
---
