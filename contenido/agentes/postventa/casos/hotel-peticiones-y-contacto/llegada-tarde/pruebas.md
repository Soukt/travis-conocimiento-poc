---
caso: llegada-tarde
pruebas:
  - pregunta: Nuestro vuelo llega a medianoche, ¿habrá alguien en recepción?
    reserva: hotel que admite llegada tarde, entrada dentro de 5 días
    mercado: es
    esperado: Da el horario de entrada y si admite llegada tarde tal como lo devuelve la acción y crea el ticket con la hora de llegada para avisar al hotel.
  - pregunta: Arriveremo in hotel verso le 23, c'è qualche problema?
    reserva: hotel que no admite llegada tarde, entrada mañana
    mercado: it
    esperado: Contesta en italiano, no promete que le esperen y crea el ticket para que booking busque una solución con el hotel.
  - pregunta: llegamos tardisimo, avisad al hotel porfa
    reserva: entrada dentro de 3 días
    mercado: es
    esperado: Pregunta la hora aproximada de llegada antes de crear el ticket.
---
