---
caso: reservar-aparcamiento
pruebas:
  - pregunta: quiero reservar sitio para el coche las 3 noches
    reserva: alojamiento con aparcamiento de pago, entrada dentro de 14 días
    mercado: es
    esperado: Dice lo que devuelve la acción sobre el aparcamiento, no confirma la plaza ni da otro precio, crea el ticket con las noches y contesta con la plantilla de derivado a booking.
  - pregunta: Bisogna prenotare il parcheggio o si può arrivare direttamente?
    reserva: alojamiento sin datos de aparcamiento, entrada dentro de 9 días
    mercado: it
    esperado: Contesta en italiano, no supone nada sobre el aparcamiento y pasa la consulta a booking para que lo pregunte al hotel.
---
