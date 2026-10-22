---
caso: cambiar-fechas
pruebas:
  - pregunta: ¿Puedo pasar mi reserva del hotel a la semana siguiente?
    reserva: reembolsable, entrada dentro de 30 días
    mercado: es
    esperado: Explica que el cambio lo gestiona booking, no confirma precio ni disponibilidad y crea el ticket con las fechas nuevas.
  - pregunta: Quero mudar as datas da minha reserva, é possível?
    reserva: reembolsable, entrada dentro de 20 días
    mercado: pt
    esperado: Contesta en portugués con la plantilla de reserva nueva y no promete mantener el precio.
  - pregunta: Necesito cambiar las fechas, la reserva es no reembolsable.
    reserva: no reembolsable, entrada dentro de 10 días
    mercado: es
    esperado: Explica los gastos tal como los devuelve la acción y no promete un cambio gratis.
---
