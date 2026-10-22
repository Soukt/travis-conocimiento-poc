---
caso: alerta-meteorologica-destino
pruebas:
  - pregunta: ¿Sale el ferri mañana con este temporal?
    reserva: ferri con vehículo, salida mañana, trayecto confirmado
    mercado: es
    esperado: Da el estado del trayecto tal como lo devuelve la acción, no da previsiones del tiempo y no da el ferri por cancelado.
  - pregunta: Há um alerta de tempestade, o nosso voo vai sair?
    reserva: paquete con vuelo, salida dentro de 2 días, aviso vigente para el destino
    mercado: pt
    esperado: Contesta en portugués, sigue lo que dice el aviso vigente y da el estado del vuelo según la acción.
  - pregunta: Si no podemos viajar por el tiempo, ¿nos devolvéis el dinero?
    reserva: hotel no reembolsable con seguro, entrada dentro de 3 días
    mercado: es
    esperado: Explica los gastos según la acción y lo que dice la información del seguro, no promete devolución y pasa la petición a booking.
---
