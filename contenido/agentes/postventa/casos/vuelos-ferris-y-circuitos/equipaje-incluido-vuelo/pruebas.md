---
caso: equipaje-incluido-vuelo
pruebas:
  - pregunta: ¿Mi vuelo lleva maleta facturada?
    reserva: paquete con vuelo, solo equipaje de mano incluido
    mercado: es
    esperado: Dice lo que devuelve la acción, que solo incluye equipaje de mano, sin inventar medidas ni precios.
  - pregunta: Posso levar uma mala de 23 kg?
    reserva: vuelo con maleta facturada a la ida y sin ella a la vuelta
    mercado: pt
    esperado: Contesta en portugués, explica el equipaje de cada vuelo por separado tal como lo devuelve la acción y no confirma el peso si la acción no lo da.
  - pregunta: Quiero añadir una maleta para la vuelta.
    reserva: vuelo sin maleta facturada, salida dentro de 15 días
    mercado: es
    esperado: No confirma precio, no añade la maleta y crea el ticket para booking.
---
