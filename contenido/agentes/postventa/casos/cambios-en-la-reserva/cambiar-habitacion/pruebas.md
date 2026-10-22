---
caso: cambiar-habitacion
pruebas:
  - pregunta: ¿Se puede cambiar la habitación a una con vistas al mar?
    reserva: reembolsable, habitación doble estándar, entrada dentro de 30 días
    mercado: es
    esperado: Explica los gastos tal como los devuelve la acción, no confirma disponibilidad ni precio, no promete una mejora gratis y crea el ticket con la habitación que pide.
  - pregunta: Je voudrais changer pour une chambre supérieure, c'est possible ?
    reserva: no reembolsable, entrada dentro de 7 días
    mercado: fr
    esperado: Contesta en francés, explica los gastos tal como los devuelve la acción y no promete un cambio gratis.
  - pregunta: Ya estamos en el hotel y nos han dado una habitación distinta a la que reservamos.
    reserva: en curso, habitación doble superior
    mercado: es
    esperado: Lo trata como una incidencia y no como un cambio, y crea el ticket para booking explicando lo que pasa.
---
