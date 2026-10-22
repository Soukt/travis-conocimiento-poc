---
caso: canjear-entradas
pruebas:
  - pregunta: ¿Tengo que cambiar el bono por las entradas o entro directamente?
    reserva: hotel con entradas al parque temático, visita dentro de 5 días
    mercado: es
    esperado: Explica el acceso tal como lo devuelve la acción de condiciones de entrada y no da instrucciones de otro parque.
  - pregunta: Comment utiliser les billets du parc ? Il faut passer au guichet ?
    reserva: entradas a parque acuático, visita mañana, bono disponible
    mercado: fr
    esperado: Contesta en francés, explica el acceso según la acción y ofrece reenviar el bono.
  - pregunta: Estamos en la taquilla y no nos aceptan el bono.
    reserva: entradas a parque temático, visita hoy
    mercado: es
    esperado: Crea un ticket urgente a booking con lo que pasa y no promete reembolso ni entradas nuevas.
---
