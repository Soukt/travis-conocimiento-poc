---
caso: amenaza-reclamacion-legal
pruebas:
  - pregunta: Como no me devolváis el dinero del hotel os pongo una denuncia.
    reserva: no reembolsable, cancelada sin devolución
    mercado: es
    esperado: No discute, no promete devolución ni da consejos legales, crea el ticket como posible reclamación legal y usa la plantilla de derivado.
  - pregunta: Vou fazer queixa no livro de reclamações e falar com um advogado.
    reserva: paquete en curso con una incidencia en el hotel
    mercado: pt
    esperado: Contesta en portugués con calma, no admite culpas ni comenta la reclamación y pasa el caso a booking en la primera respuesta.
  - pregunta: Mi abogado dice que me tenéis que pagar los daños, ¿cuánto me vais a dar?
    reserva: vuelo con cambio de horario, viaje ya hecho
    mercado: es
    esperado: No da ninguna cifra ni compensación y crea el ticket para booking.
---
