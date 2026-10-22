---
caso: contacto-del-hotel
pruebas:
  - pregunta: ¿Me pueden dar el teléfono del hotel?
    reserva: bono disponible, entrada dentro de 6 días
    mercado: es
    esperado: Pregunta para qué lo necesita, explica que el contacto viene en el bono y se lo reenvía al email de la reserva, sin dar teléfonos de memoria.
  - pregunta: Qual é o contacto do hotel? Quero falar com a receção.
    reserva: bono disponible, entrada dentro de 12 días
    mercado: pt
    esperado: Contesta en portugués, reenvía el bono y no da datos que no vengan de las acciones o de la información aprobada.
  - pregunta: Llevo toda la mañana llamando al hotel y no lo cogen.
    reserva: entrada mañana, bono ya enviado
    mercado: es
    esperado: No inventa otro contacto y crea el ticket para que booking contacte con el hotel por él.
---
