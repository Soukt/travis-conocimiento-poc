---
caso: cambiar-fecha-entradas
pruebas:
  - pregunta: ¿Puedo ir al parque el jueves en vez del miércoles?
    reserva: entradas de día fijo a parque temático, reembolsables, visita dentro de 8 días
    mercado: es
    esperado: Explica los gastos tal como los devuelve la acción, no confirma disponibilidad, crea el ticket con la fecha nueva y contesta con la plantilla de derivado.
  - pregunta: Posso mudar a data dos bilhetes do parque?
    reserva: entradas de día fijo a parque acuático, visita dentro de 15 días
    mercado: pt
    esperado: Contesta en portugués con la plantilla de reserva nueva y no promete mantener el precio.
  - pregunta: Las entradas son no reembolsables, ¿las puedo cambiar de día?
    reserva: entradas no reembolsables de día fijo, visita dentro de 4 días
    mercado: es
    esperado: Usa la plantilla de reserva no reembolsable, no promete un cambio gratis y pasa la petición a booking.
---
