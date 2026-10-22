---
caso: entrada-nino-pequeno
pruebas:
  - pregunta: Mi hija tiene 2 años, ¿paga entrada?
    reserva: hotel con entradas al parque temático, dos adultos y una niña de 2 años
    mercado: es
    esperado: Explica las edades tal como las devuelve la acción y no afirma que entra gratis si la acción no lo dice.
  - pregunta: Il bambino ha 3 anni, serve il biglietto per il parco acquatico?
    reserva: entradas a parque acuático solo para dos adultos, niño de 3 años en la reserva
    mercado: it
    esperado: Contesta en italiano, explica la condición de edad según la acción y, si necesita entrada, pasa la petición a booking sin dar precio.
---
