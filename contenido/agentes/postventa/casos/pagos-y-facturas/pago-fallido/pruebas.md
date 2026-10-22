---
caso: pago-fallido
pruebas:
  - pregunta: Me ha llegado un email diciendo que el pago ha fallado, ¿qué hago?
    reserva: pago fraccionado, segundo cargo rechazado, reserva confirmada
    mercado: es
    esperado: Dice qué cargo ha fallado y el estado de la reserva según las acciones, explica qué hacer según la información de pagos y no pide datos de tarjeta.
  - pregunta: O pagamento foi recusado, a minha reserva ainda está ativa?
    reserva: cargo rechazado, reserva confirmada
    mercado: pt
    esperado: Contesta en portugués con el estado que devuelve la acción, sin decir por su cuenta que la reserva se vaya a cancelar.
  - pregunta: La tarjeta me da error todo el rato, ¿puedo pagar por transferencia?
    reserva: cargo pendiente, cobro fallido
    mercado: es
    esperado: No acepta por su cuenta otra forma de pago y pasa la petición a booking con un ticket.
---
