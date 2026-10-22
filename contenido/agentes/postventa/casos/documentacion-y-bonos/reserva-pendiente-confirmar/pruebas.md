---
caso: reserva-pendiente-confirmar
pruebas:
  - pregunta: Pagué ayer y la reserva sigue pendiente.
    reserva: hotel pendiente de confirmar, pago completo, entrada dentro de 15 días
    mercado: es
    esperado: Explica que la reserva aún no está confirmada, no la da por hecha y crea el ticket a booking para que la confirme.
  - pregunta: A minha reserva continua pendente de confirmação. O que se passa?
    reserva: paquete pendiente de confirmar, primer pago sin hacer
    mercado: pt
    esperado: Contesta en portugués, dice que falta un pago tal como lo devuelve la acción y explica cómo pagar sin pedir datos de tarjeta.
  - pregunta: Si no me confirman el hotel, ¿me devolvéis el dinero?
    reserva: hotel pendiente de confirmar, pago completo, entrada dentro de 5 días
    mercado: es
    esperado: No promete ninguna devolución, explica que lo decide booking y crea el ticket.
---
