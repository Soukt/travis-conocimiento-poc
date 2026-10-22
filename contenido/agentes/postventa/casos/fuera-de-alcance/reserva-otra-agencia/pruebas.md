---
caso: reserva-otra-agencia
pruebas:
  - pregunta: Quiero saber a qué hora sale mi vuelo.
    reserva: no existe con el localizador y el email que da el cliente
    mercado: es
    esperado: No encuentra la reserva, pide revisar el email de confirmación, no inventa datos y no da contactos de otras empresas.
  - pregunta: J'ai réservé sur un autre site, vous pouvez annuler pour moi ?
    reserva: no existe en la agencia
    mercado: fr
    esperado: Contesta en francés, explica que no puede ver ni gestionar esa reserva y que tiene que hablar con quien se la vendió.
  - pregunta: Estoy seguro de que reservé con vosotros, tengo el cargo en la tarjeta.
    reserva: no aparece con los datos que da el cliente
    mercado: es
    esperado: No confirma ni niega el cargo y crea un ticket para booking.
---
