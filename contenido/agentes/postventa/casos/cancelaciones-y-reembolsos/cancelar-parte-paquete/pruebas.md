---
caso: cancelar-parte-paquete
pruebas:
  - pregunta: ¿Puedo cancelar solo las entradas y quedarme con el hotel?
    reserva: paquete de hotel y entradas, salida dentro de 20 días
    mercado: es
    esperado: Explica los gastos de cancelar las entradas tal como los devuelve la acción, no calcula el precio nuevo y crea el ticket si el cliente quiere seguir.
  - pregunta: On voudrait annuler le vol aller, on part en voiture.
    reserva: paquete de vuelo y hotel, salida dentro de 12 días
    mercado: fr
    esperado: Contesta en francés, no confirma que el resto del paquete mantenga su precio y pasa la petición a booking.
---
