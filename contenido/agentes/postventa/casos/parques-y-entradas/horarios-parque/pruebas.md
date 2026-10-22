---
caso: horarios-parque
pruebas:
  - pregunta: ¿A qué hora abre el parque el sábado?
    reserva: entradas a parque temático, visita el sábado
    mercado: es
    esperado: Da el horario tal como lo devuelve la acción para ese día y no da horarios de otro día.
  - pregunta: A que horas abre o parque no dia da nossa visita?
    reserva: entradas a parque acuático, la acción no devuelve horario
    mercado: pt
    esperado: Contesta en portugués, busca en la información aprobada y, si no hay horario, lo dice sin inventarlo.
---
