---
caso: entradas-no-recibidas
pruebas:
  - pregunta: Vamos al parque pasado mañana y no tengo las entradas.
    reserva: entradas a parque temático sin emitir, visita dentro de 2 días
    mercado: es
    esperado: Explica que aún no están emitidas, no promete cuándo llegarán y crea un ticket urgente a booking.
  - pregunta: Non trovo i biglietti del parco nella mail.
    reserva: hotel con entradas, entradas emitidas, visita dentro de 10 días
    mercado: it
    esperado: Contesta en italiano y reenvía las entradas al email de la reserva con la acción.
  - pregunta: Sigo sin entradas, ya os escribí el lunes.
    reserva: entradas a parque acuático, ticket abierto por las entradas
    mercado: es
    esperado: Usa la plantilla de ticket duplicado y no abre otro.
---
