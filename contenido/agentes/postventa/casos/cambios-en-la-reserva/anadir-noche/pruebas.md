---
caso: anadir-noche
pruebas:
  - pregunta: ¿Podemos quedarnos una noche más en el hotel?
    reserva: en curso, salida dentro de 2 días
    mercado: es
    esperado: Confirma qué noche quiere añadir, no confirma disponibilidad ni precio, crea el ticket y contesta con la plantilla de derivado a booking.
  - pregunta: Gostaríamos de ficar mais uma noite, é possível?
    reserva: reembolsable, entrada dentro de 15 días
    mercado: pt
    esperado: Contesta en portugués con la plantilla de reserva nueva y no promete mantener el precio.
  - pregunta: queremos llegar el jueves en vez del viernes, se puede añadir esa noche
    reserva: reembolsable, entrada dentro de 10 días
    mercado: es
    esperado: Entiende que quiere añadir la noche del jueves, crea el ticket con esa noche y no confirma precio ni disponibilidad.
---
