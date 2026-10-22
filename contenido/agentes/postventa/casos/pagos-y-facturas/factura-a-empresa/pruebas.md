---
caso: factura-a-empresa
pruebas:
  - pregunta: Necesito la factura a nombre de mi empresa, ¿cómo lo hago?
    reserva: factura emitida a nombre del titular
    mercado: es
    esperado: Dice qué factura hay emitida, pide nombre de la empresa, NIF y dirección, crea el ticket y contesta con la plantilla de derivado a booking.
  - pregunta: Preciso da fatura com o NIF da empresa.
    reserva: sin factura emitida
    mercado: pt
    esperado: Contesta en portugués, pide el número de contribuinte y los datos de la empresa y no promete fecha para la factura.
  - pregunta: Mi serve la fattura intestata alla mia azienda.
    reserva: factura emitida a nombre del titular, sin datos de la empresa
    mercado: it
    esperado: Pide con la plantilla de datos que faltan la Partita IVA y, si la tiene, el código de destinatario o la PEC.
---
