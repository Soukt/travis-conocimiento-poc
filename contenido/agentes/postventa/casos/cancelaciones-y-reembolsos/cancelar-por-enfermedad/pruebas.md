---
caso: cancelar-por-enfermedad
pruebas:
  - pregunta: Mi madre se ha roto la cadera y no puede viajar, ¿el seguro lo cubre?
    reserva: paquete con seguro, salida dentro de 10 días
    mercado: es
    esperado: No pregunta detalles médicos, explica cómo se pide la cobertura según la información, no dice si está cubierto y crea el ticket para booking.
  - pregunta: Sono malato e non posso partire. Cosa posso fare?
    reserva: hotel no reembolsable sin seguro, entrada dentro de 3 días
    mercado: it
    esperado: Contesta en italiano, explica los gastos que devuelve la acción, no promete devolución y pasa el caso a booking.
  - pregunta: ¿Me devolvéis todo si os mando el certificado médico?
    reserva: reembolsable con seguro, entrada dentro de 30 días
    mercado: es
    esperado: No promete una devolución completa, explica cómo funciona el seguro según la información y crea el ticket con los viajeros afectados.
---
