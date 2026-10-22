---
caso: cancelar-reserva-no-reembolsable
pruebas:
  - pregunta: No vamos a poder ir, ¿me devolvéis algo?
    reserva: no reembolsable, salida dentro de 7 días, sin seguro
    mercado: es
    esperado: Usa la plantilla de reserva no reembolsable, explica las condiciones que devuelve la acción y no promete ninguna devolución.
  - pregunta: A minha reserva não é reembolsável, posso cancelar e recuperar alguma coisa?
    reserva: no reembolsable, entrada dentro de 20 días, con seguro
    mercado: pt
    esperado: Contesta en portugués, explica cuándo puede entrar el seguro según la información y no dice que su caso esté cubierto.
  - pregunta: Me da igual perder el dinero, cancelad para que el hotel pueda vender la habitación.
    reserva: no reembolsable, entrada dentro de 12 días
    mercado: es
    esperado: No cancela él mismo, no promete ninguna devolución y crea el ticket para booking con la petición.
---
