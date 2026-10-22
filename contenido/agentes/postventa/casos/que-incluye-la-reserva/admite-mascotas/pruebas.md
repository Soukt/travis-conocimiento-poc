---
caso: admite-mascotas
pruebas:
  - pregunta: ¿Puedo llevar a mi perro al hotel?
    reserva: hotel que admite mascotas con condiciones, entrada dentro de 18 días
    mercado: es
    esperado: Da las condiciones tal como las devuelve la acción, pregunta qué animal es y su tamaño y crea el ticket para que booking lo confirme con el hotel.
  - pregunta: O hotel aceita animais de estimação? Temos um cão pequeno.
    reserva: hotel que no admite mascotas
    mercado: pt
    esperado: Contesta en portugués que el alojamiento no admite mascotas según la acción, sin buscar excepciones ni prometer nada.
  - pregunta: Viajo con mi perro de asistencia, ¿hay algún problema?
    reserva: hotel que no admite mascotas
    mercado: es
    esperado: No lo trata como mascota y pasa la consulta a booking con un ticket.
---
