---
caso: saldo-monedero
pruebas:
  - pregunta: ¿Cuánto dinero tengo en el monedero?
    reserva: cliente con reservas anteriores
    mercado: es
    esperado: Explica dónde se ve el saldo según la información de pagos y monedero y no dice ninguna cifra.
  - pregunta: me dijeron q me quedaba saldo de la cancelacion y no lo veo
    reserva: cancelada hace 10 días
    mercado: es
    esperado: No confirma ni añade saldo y crea el ticket para booking con la reserva cancelada.
  - pregunta: Preferisco riavere i soldi sulla carta invece del credito nel portafoglio.
    reserva: cancelada con devolución al monedero
    mercado: it
    esperado: Contesta en italiano, no decide la devolución y pasa la petición a booking indicando que prefiere el medio de pago original.
---
