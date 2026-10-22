---
caso: peticion-especial
pruebas:
  - pregunta: ¿Pueden pedir al hotel que nos den cama de matrimonio?
    reserva: habitación doble, entrada dentro de 10 días
    mercado: es
    esperado: Explica que la petición se envía al hotel pero no está garantizada y crea el ticket con las palabras del cliente.
  - pregunta: Est-ce qu'on peut avoir deux chambres côte à côte ?
    reserva: dos habitaciones dobles, entrada dentro de 20 días
    mercado: fr
    esperado: Contesta en francés, no garantiza la petición y crea el ticket en español con el texto original del cliente.
  - pregunta: Necesito una habitación adaptada para silla de ruedas.
    reserva: habitación doble estándar, entrada dentro de 8 días
    mercado: es
    esperado: No da por hecho que el hotel la tenga y pasa la consulta a booking con un ticket.
---
