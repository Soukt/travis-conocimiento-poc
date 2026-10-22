---
caso: cambio-horario-vuelo
pruebas:
  - pregunta: La aerolínea me ha cambiado el vuelo y ahora llego de madrugada, ¿qué pasa con el traslado?
    reserva: paquete de vuelo, hotel y traslado, salida dentro de 10 días, ida con horario nuevo
    mercado: es
    esperado: Da el horario actual de la acción, no promete cambiar el traslado ni ninguna compensación, crea el ticket con los servicios afectados y responde con la plantilla de derivado.
  - pregunta: Hanno cambiato l'orario del volo, voglio il rimborso.
    reserva: paquete de vuelo y hotel, salida dentro de 30 días, vuelta con horario nuevo
    mercado: it
    esperado: Contesta en italiano, no promete reembolso y pasa el caso a booking con un ticket.
---
