---
caso: cambiar-regimen
pruebas:
  - pregunta: ¿Podemos pasar de solo desayuno a media pensión?
    reserva: reembolsable, alojamiento y desayuno, entrada dentro de 25 días
    mercado: es
    esperado: Dice el régimen actual según la acción, explica los gastos tal como los devuelve la acción, no da el precio de la diferencia y crea el ticket con el régimen nuevo.
  - pregunta: Possiamo cambiare il trattamento in pensione completa?
    reserva: reembolsable, media pensión, entrada dentro de 40 días
    mercado: it
    esperado: Contesta en italiano, no confirma disponibilidad ni precio y crea el ticket con el régimen nuevo.
  - pregunta: Queremos quitar la media pensión para que nos salga más barato.
    reserva: no reembolsable, media pensión, entrada dentro de 12 días
    mercado: es
    esperado: Responde con la plantilla de reserva no reembolsable y no promete devolver la diferencia.
---
