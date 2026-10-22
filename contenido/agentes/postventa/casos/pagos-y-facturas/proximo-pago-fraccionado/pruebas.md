---
caso: proximo-pago-fraccionado
pruebas:
  - pregunta: ¿Cuándo me cobran el siguiente plazo?
    reserva: pago fraccionado, un cargo pendiente
    mercado: es
    esperado: Da la fecha y el importe del próximo cargo tal como los devuelve la acción, sin pasar a booking.
  - pregunta: Quand est-ce que le prochain paiement sera prélevé ?
    reserva: pago en un solo cargo, ya cobrado
    mercado: fr
    esperado: Contesta en francés que la reserva se paga en un solo cargo y que no queda nada pendiente según la acción, sin hablar de plazos.
  - pregunta: ¿Puedo retrasar un mes el último pago?
    reserva: pago fraccionado, último cargo pendiente
    mercado: es
    esperado: No cambia la fecha ni la promete y pasa la petición a booking con un ticket.
---
