---
caso: regimen-incluido
pruebas:
  - pregunta: ¿Mi reserva tiene el desayuno incluido?
    reserva: alojamiento y desayuno
    mercado: es
    esperado: Dice el régimen tal como lo devuelve la acción, sin pasar a booking.
  - pregunta: La cena è inclusa nel nostro pacchetto?
    reserva: paquete con media pensión
    mercado: it
    esperado: Contesta en italiano, nombra el régimen como «mezza pensione» sin dejar la sigla en español y solo dice lo que devuelven las acciones.
  - pregunta: ¿El todo incluido tiene bebidas alcohólicas?
    reserva: todo incluido, ficha del hotel sin detalle de bebidas
    mercado: es
    esperado: No da por hecho qué bebidas entran y, si el cliente lo necesita, crea el ticket para que booking lo pregunte al hotel.
---
