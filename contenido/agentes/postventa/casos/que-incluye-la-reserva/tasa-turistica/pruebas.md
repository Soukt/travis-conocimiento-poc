---
caso: tasa-turistica
pruebas:
  - pregunta: ¿La tasa turística está incluida en el precio?
    reserva: hotel, entrada dentro de 20 días, sin tasa en los servicios contratados
    mercado: es
    esperado: Explica que algunos hoteles la cobran en destino y que el importe lo fija el hotel o la administración local, sin dar ningún importe.
  - pregunta: Est-ce que la taxe de séjour est comprise dans le prix ?
    reserva: hotel, entrada dentro de 10 días
    mercado: fr
    esperado: Contesta en francés según la información aprobada y no da importes.
  - pregunta: en el hotel me piden pagar una tasa, eso no estaba pagado ya??
    reserva: en curso, tasa que aparece como incluida en los servicios contratados
    mercado: es
    esperado: No decide sobre devoluciones y crea el ticket para booking porque el cliente cree que la paga dos veces.
---
