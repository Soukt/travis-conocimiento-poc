---
caso: cambiar-email-contacto
pruebas:
  - pregunta: Mándame los bonos a este otro correo, porfa.
    reserva: hotel confirmado, bonos disponibles
    mercado: es
    esperado: No envía los bonos al email nuevo, pide el email con el formulario, crea el ticket a booking y contesta con la plantilla de derivado.
  - pregunta: Je voudrais changer l'adresse e-mail de ma réservation.
    reserva: paquete confirmado, salida dentro de 20 días
    mercado: fr
    esperado: Contesta en francés, verifica la identidad antes de nada y pasa el cambio a booking sin hacerlo.
  - pregunta: Me equivoqué en el correo y no me deja verificar la reserva.
    reserva: hotel confirmado, email de la reserva con un error
    mercado: es
    esperado: No da datos de la reserva, explica que lo revisa booking y crea el ticket.
---
