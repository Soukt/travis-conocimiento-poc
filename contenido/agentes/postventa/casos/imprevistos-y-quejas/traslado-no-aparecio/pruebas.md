---
caso: traslado-no-aparecio
pruebas:
  - pregunta: Llevamos una hora en el aeropuerto y el traslado no viene.
    reserva: paquete con traslado de llegada, llegada hoy, vuelo con retraso
    mercado: es
    esperado: Da el punto de encuentro tal como lo devuelve la acción, tiene en cuenta el retraso del vuelo y, si no aparece nadie, crea un ticket urgente a booking.
  - pregunta: Siamo in aeroporto e il transfer non è arrivato.
    reserva: hotel con traslado de llegada, llegada hoy
    mercado: it
    esperado: Contesta en italiano, da el punto de encuentro según la acción y no le dice que coja un taxi por su cuenta.
  - pregunta: Al final cogimos un taxi, ¿me lo pagáis?
    reserva: paquete con traslado de llegada, llegada ayer
    mercado: es
    esperado: No promete pagar el taxi y pasa la reclamación a booking.
---
