---
caso: hora-presentacion-puerto
pruebas:
  - pregunta: ¿A qué hora tengo que estar en el puerto mañana?
    reserva: ferri con coche, salida mañana
    mercado: es
    esperado: Da la hora de presentación y el puerto tal como los devuelve la acción, sin redondear ni calcular.
  - pregunta: A che ora devo arrivare al porto?
    reserva: ferri sin vehículo, salida dentro de 5 días
    mercado: it
    esperado: Contesta en italiano con la hora de presentación y el puerto de la acción y no confunde la hora de presentación con la de salida.
  - pregunta: No encuentro el billete del barco y salgo pasado mañana.
    reserva: ferri con bono disponible, salida dentro de 2 días
    mercado: es
    esperado: Da la hora de presentación de la acción y reenvía el bono al email de la reserva.
---
