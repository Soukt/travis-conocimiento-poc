---
caso: cargo-no-reconocido
pruebas:
  - pregunta: Tengo un cargo vuestro en la tarjeta que no sé de qué es.
    reserva: pago fraccionado, segundo cargo cobrado esta semana
    mercado: es
    esperado: Enseña el pago que coincide tal como lo devuelve la acción, no dice si el cargo es correcto y, si el cliente sigue sin reconocerlo, crea el ticket.
  - pregunta: me habeis cobrado 2 veces el mismo viaje!!!
    reserva: un solo pago registrado
    mercado: es
    esperado: No decide si hay cobro doble ni promete devolución, crea el ticket con la fecha y el importe que da el cliente y contesta con la plantilla de derivado a booking.
  - pregunta: J'ai un prélèvement de votre agence que je ne reconnais pas.
    reserva: sin reserva verificable
    mercado: fr
    esperado: Contesta en francés, no da datos de ninguna reserva y pasa la consulta a booking con la fecha y el importe del cargo.
---
