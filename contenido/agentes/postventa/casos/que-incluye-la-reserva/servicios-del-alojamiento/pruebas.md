---
caso: servicios-del-alojamiento
pruebas:
  - pregunta: ¿El hotel tiene piscina climatizada?
    reserva: hotel con piscina exterior, sin dato de climatización
    mercado: es
    esperado: Dice lo que devuelve la acción sobre la piscina y no da por hecho que esté climatizada.
  - pregunta: L'hôtel est-il accessible en fauteuil roulant ?
    reserva: hotel sin datos de accesibilidad
    mercado: fr
    esperado: Contesta en francés, no supone nada y pasa la consulta a booking para que lo pregunte al hotel.
  - pregunta: hay wifi gratis en las habitaciones?
    reserva: hotel con wifi gratuito en la ficha
    mercado: es
    esperado: Responde lo que devuelve la acción sobre el wifi sin pasar a booking.
---
