---
caso: corregir-edad-nino
pruebas:
  - pregunta: Puse que mi hijo tiene 2 años y tiene 3.
    reserva: hotel con entradas al parque, dos adultos y un niño, entrada dentro de 20 días
    mercado: es
    esperado: Explica las edades de las entradas tal como las da la acción, no dice si el precio cambia y crea el ticket con la edad correcta.
  - pregunta: Na reserva o meu filho aparece com 10 anos, mas tem 12.
    reserva: hotel, dos adultos y un niño, entrada dentro de 45 días
    mercado: pt
    esperado: Contesta en portugués, no promete que el precio se mantenga y pasa la corrección a booking.
---
