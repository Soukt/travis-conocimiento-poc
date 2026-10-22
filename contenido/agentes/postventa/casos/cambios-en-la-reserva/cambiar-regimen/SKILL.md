---
name: cambiar-regimen
description: El cliente quiere cambiar el régimen de comidas de su reserva de hotel, por ejemplo pasar de solo desayuno a media pensión.
metadata:
  titulo: Cambiar el régimen de comidas
  area: cambios-en-la-reserva
  modo: copiloto
  acciones:
    - verificar-identidad
    - consultar-reserva
    - consultar-politica-cancelacion
    - crear-ticket-booking
  informacion:
    - comun/cambios-de-reserva
  plantillas:
    - reserva-no-reembolsable
  simulado: "true"
---
## Cuándo aplica

- El cliente quiere subir o bajar el régimen de comidas: solo alojamiento, desayuno, media pensión, pensión completa o todo incluido.
- La reserva todavía no ha empezado o está en curso.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-reserva` qué régimen tiene contratado y para qué fechas.
3. Consulta con `consultar-politica-cancelacion` si la reserva es reembolsable y qué gastos tendría el cambio, y se lo explica tal como lo devuelve la acción.
4. Si la reserva es no reembolsable y el cliente quiere bajar de régimen para pagar menos, contesta con `reserva-no-reembolsable` y no promete devolver la diferencia.
5. Explica cómo funcionan los cambios de régimen según `comun/cambios-de-reserva`.
6. Si el cliente quiere seguir, pasa la petición a booking con `crear-ticket-booking`, con el régimen nuevo y las noches a las que afecta.

## Qué no hace

- No confirma que el hotel tenga el régimen nuevo disponible.
- No da el precio de la diferencia ni promete devolver dinero.
- No cambia la reserva.

## Cuándo pasa a una persona

- Siempre que el cliente quiera seguir adelante con el cambio.
- Si el cliente ya está en el hotel y quiere el cambio para las noches que le quedan.

## Cómo lo puede pedir el cliente

- «¿Puedo pasar de solo desayuno a media pensión?»
- «queremos el todo incluido en vez de la media pension, cuanto cuesta?»
- «Possiamo cambiare il trattamento in pensione completa?»
