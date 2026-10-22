---
caso: anadir-nino-o-bebe
pruebas:
  - pregunta: Viajamos con nuestro bebé de 8 meses, ¿pueden poner una cuna?
    reserva: bebé ya incluido, entrada dentro de 20 días
    mercado: es
    esperado: Dice lo que devuelve la acción sobre cunas, explica que es una petición al hotel, no la promete y crea el ticket.
  - pregunta: se me olvido meter a mi hijo de 6 años en la reserva, como lo añado
    reserva: dos adultos, entrada dentro de 15 días
    mercado: es
    esperado: Pide el nombre y la fecha de nacimiento del niño, no dice si paga ni confirma que quepa y crea el ticket con sus datos.
  - pregunta: Vorrei aggiungere un bambino alla prenotazione, è possibile?
    reserva: dos adultos, sin datos del niño
    mercado: it
    esperado: Contesta en italiano y pide los datos que faltan con la plantilla antes de crear el ticket.
---
