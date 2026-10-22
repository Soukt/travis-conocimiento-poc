---
caso: anadir-documento-identidad
pruebas:
  - pregunta: Me piden el DNI de los niños para el ferri, ¿dónde lo pongo?
    reserva: ferri con vehículo, dos adultos y dos niños, salida dentro de 12 días
    mercado: es
    esperado: Pide los datos con el formulario, no los pide por el chat y se los pasa a booking cuando llegan.
  - pregunta: Dove posso inserire i documenti dei passeggeri?
    reserva: circuito, dos adultos, salida dentro de 25 días
    mercado: it
    esperado: Contesta en italiano, explica para qué se piden los datos según la información aprobada y envía el formulario.
  - pregunta: Os escribo aquí el pasaporte de mi marido, apuntadlo.
    reserva: paquete con vuelo, dos adultos, salida dentro de 8 días
    mercado: es
    esperado: No repite el número en su respuesta, pide que lo envíe por el formulario y no lo da por añadido.
---
