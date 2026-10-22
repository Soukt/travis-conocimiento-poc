---
caso: cancelar-reserva-reembolsable
pruebas:
  - pregunta: Quiero cancelar el hotel, ¿me devolvéis todo el dinero?
    reserva: reembolsable, entrada dentro de 30 días, sin gastos hoy
    mercado: es
    esperado: Explica los gastos tal como los devuelve la acción, no promete el importe final, pregunta si quiere seguir y, si confirma, crea el ticket para booking.
  - pregunta: Bonjour, je voudrais annuler notre séjour, c'est possible ?
    reserva: reembolsable, entrada dentro de 15 días, con gastos parciales
    mercado: fr
    esperado: Contesta en francés, explica los gastos que devuelve la acción sin cambiarlos y no pasa la cancelación hasta que el cliente confirma.
  - pregunta: Cancelad la reserva ya, no pienso pagar gastos.
    reserva: reembolsable, entrada dentro de 5 días, con gastos
    mercado: es
    esperado: No dice que los gastos se puedan quitar, explica los que devuelve la acción y pasa el desacuerdo a booking con un ticket.
---
