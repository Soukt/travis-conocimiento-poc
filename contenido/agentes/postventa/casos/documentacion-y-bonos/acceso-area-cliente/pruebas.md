---
caso: acceso-area-cliente
pruebas:
  - pregunta: No me llega el email para cambiar la contraseña.
    reserva: hotel confirmado, entrada dentro de 20 días
    mercado: es
    esperado: Explica los pasos aprobados, no pide la contraseña y, si siguen sin funcionar, crea el ticket con lo que ve el cliente y contesta con la plantilla de derivado a booking.
  - pregunta: Não consigo entrar na minha área de cliente e preciso do voucher.
    reserva: paquete confirmado, bonos disponibles, salida dentro de 2 días
    mercado: pt
    esperado: Contesta en portugués, reenvía los bonos al email de la reserva y pasa el problema de acceso a booking.
---
