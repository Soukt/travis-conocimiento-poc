---
caso: vehiculo-o-mascota-ferri
pruebas:
  - pregunta: ¿Puedo llevar a mi perro en el ferri?
    reserva: ferri sin vehículo ni mascota, salida dentro de 25 días
    mercado: es
    esperado: Explica las condiciones generales según la información, no confirma plaza para la mascota y crea el ticket para booking si quiere añadirla.
  - pregunta: On a changé de voiture, il faut modifier la réservation ?
    reserva: ferri con coche, salida dentro de 10 días
    mercado: fr
    esperado: Contesta en francés, dice el vehículo que figura según la acción y pasa el cambio a booking sin dar precio.
  - pregunta: ¿Tengo incluido el coche en el barco?
    reserva: ferri con coche incluido
    mercado: es
    esperado: Confirma el vehículo tal como lo devuelve la acción y no crea ticket.
---
