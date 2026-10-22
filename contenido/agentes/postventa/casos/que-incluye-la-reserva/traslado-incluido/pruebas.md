---
caso: traslado-incluido
pruebas:
  - pregunta: ¿El paquete incluye el traslado del aeropuerto al hotel?
    reserva: paquete con vuelo y traslado de llegada y salida
    mercado: es
    esperado: Confirma el traslado según la reserva y da el punto de encuentro y los horarios tal como los devuelve la acción.
  - pregunta: Il transfer dall'aeroporto è compreso?
    reserva: solo hotel, sin traslado
    mercado: it
    esperado: Contesta en italiano que no tiene traslado, no da precio y, si lo quiere contratar, crea el ticket.
  - pregunta: Nos han cambiado la hora del vuelo, ¿el traslado lo sabe?
    reserva: paquete con vuelo y traslado, vuelo con horario nuevo
    mercado: es
    esperado: No promete que el traslado se adapte y crea el ticket para booking con el horario nuevo.
---
