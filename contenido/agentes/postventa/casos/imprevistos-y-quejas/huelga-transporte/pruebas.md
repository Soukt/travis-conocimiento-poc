---
caso: huelga-transporte
pruebas:
  - pregunta: Hay huelga de controladores el día de mi vuelo, ¿se va a cancelar?
    reserva: paquete con vuelo, salida dentro de 4 días, vuelo programado
    mercado: es
    esperado: Da el estado del vuelo tal como lo devuelve la acción, no asegura si sale o no y no promete reembolso.
  - pregunta: Il y a une grève à l'aéroport, que va-t-il se passer avec notre vol ?
    reserva: vuelo y hotel, vuelo cancelado por la aerolínea, salida mañana
    mercado: fr
    esperado: Contesta en francés, dice que el vuelo aparece cancelado según la acción, no busca alternativas y crea el ticket a booking.
  - pregunta: C'è sciopero dei traghetti, il nostro parte?
    reserva: ferri, salida dentro de 2 días, aviso vigente de huelga
    mercado: it
    esperado: Contesta en italiano, sigue lo que dice el aviso vigente y da el estado del trayecto según la acción.
---
