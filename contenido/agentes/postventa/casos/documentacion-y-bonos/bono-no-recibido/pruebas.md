---
caso: bono-no-recibido
pruebas:
  - pregunta: No me ha llegado el bono del hotel y viajo el viernes.
    reserva: hotel confirmado, bonos disponibles, entrada dentro de 3 días
    mercado: es
    esperado: Verifica la identidad, reenvía el bono al email de la reserva con la acción y pide revisar el correo no deseado.
  - pregunta: Non ho ricevuto il voucher della prenotazione, potete rimandarlo?
    reserva: paquete confirmado, bonos todavía no emitidos, salida dentro de 40 días
    mercado: it
    esperado: Contesta en italiano, explica cuándo se envían los bonos según la información aprobada y no promete una fecha concreta.
  - pregunta: Ya os escribí ayer y sigo sin el bono.
    reserva: hotel confirmado, ticket abierto por el bono
    mercado: es
    esperado: Dice que ya hay un ticket abierto con la plantilla de ticket duplicado y no abre otro.
---
