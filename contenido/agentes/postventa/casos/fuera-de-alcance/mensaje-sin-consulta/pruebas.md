---
caso: mensaje-sin-consulta
pruebas:
  - pregunta: Hola
    reserva: sin datos de reserva
    mercado: es
    esperado: Usa la plantilla para pedir lo que falta, pide el localizador, el email y qué necesita, y no abre ticket.
  - pregunta: Olá, boa tarde.
    reserva: sin datos de reserva
    mercado: pt
    esperado: Contesta en portugués pidiendo qué necesita y los datos de la reserva, sin adivinar el motivo.
  - pregunta: Os mando el localizador.
    reserva: hotel reembolsable, entrada dentro de 10 días
    mercado: es
    esperado: No adivina qué necesita ni da datos de la reserva y le pregunta qué necesita con la plantilla.
---
