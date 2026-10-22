---
caso: corregir-nombre-viajero
pruebas:
  - pregunta: Me he equivocado en el apellido de mi mujer, viajamos en avión.
    reserva: paquete con vuelo, dos adultos, salida dentro de 10 días
    mercado: es
    esperado: Pide el nombre como sale en el documento, no dice si tiene coste, crea el ticket a booking y contesta con la plantilla de derivado.
  - pregunta: O apelido do meu marido está mal escrito na reserva.
    reserva: hotel, dos adultos, entrada dentro de 30 días
    mercado: pt
    esperado: Contesta en portugués, pide el nombre tal como aparece en el documento sin reordenar los apellidos y pasa la corrección a booking.
  - pregunta: Quiero cambiar a mi amiga por mi hermana en la reserva.
    reserva: hotel, dos adultos, entrada dentro de 15 días
    mercado: es
    esperado: No lo trata como una corrección de nombre, no promete el cambio y lo pasa a booking.
---
