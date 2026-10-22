---
caso: punto-encuentro-circuito
pruebas:
  - pregunta: ¿Dónde tenemos que estar el primer día del circuito?
    reserva: circuito con salida dentro de 4 días, punto de encuentro informado
    mercado: es
    esperado: Da el punto y la hora de encuentro tal como los devuelve la acción y recuerda llevar el bono.
  - pregunta: Onde é o ponto de encontro? E o guia fala português?
    reserva: circuito con salida dentro de 8 días, guía en español
    mercado: pt
    esperado: Contesta en portugués con el punto de encuentro de la acción, dice el idioma del guía que figura y no promete un guía en portugués.
  - pregunta: Estamos en el hotel y no sabemos dónde empieza el circuito.
    reserva: circuito que empieza hoy, sin punto de encuentro informado
    mercado: es
    esperado: No inventa un punto de encuentro y crea un ticket para booking.
---
