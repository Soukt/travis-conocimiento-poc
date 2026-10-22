---
name: factura-a-empresa
description: El cliente necesita la factura de su reserva a nombre de una empresa, con sus datos fiscales.
metadata:
  titulo: Factura a nombre de empresa
  area: pagos-y-facturas
  modo: persona
  acciones:
    - verificar-identidad
    - consultar-factura
    - pedir-datos-cliente
    - crear-ticket-booking
  informacion:
    - comun/pagos-y-monedero
  plantillas:
    - pedir-datos-que-faltan
    - derivado-a-booking
  simulado: "true"
---
## Cuándo aplica

- El cliente pide una factura a nombre de su empresa.
- El cliente ya tiene una factura a su nombre y la quiere a nombre de la empresa.

## Qué hace el agente

1. Comprueba la identidad con `verificar-identidad`.
2. Mira con `consultar-factura` qué facturas hay emitidas y a nombre de quién, y se lo dice.
3. Explica cómo se pide una factura a nombre de empresa según `comun/pagos-y-monedero`.
4. Pide los datos fiscales de la empresa con `pedir-datos-cliente`: nombre de la empresa, número fiscal y dirección. Si faltan, contesta con `pedir-datos-que-faltan`.
5. Pasa la petición a booking con `crear-ticket-booking`, con los datos de la empresa y la factura que hay que emitir o cambiar.
6. Contesta al cliente con `derivado-a-booking`.

## Qué no hace

- No emite ni cambia facturas.
- No promete una fecha para la factura nueva.
- No da consejos fiscales, como si el IVA se puede deducir.

## Cuándo pasa a una persona

- Siempre: las facturas a nombre de empresa las emite booking.

## Cómo lo puede pedir el cliente

- «Necesito la factura a nombre de mi empresa, ¿cómo lo hago?»
- «me podeis hacer la factura con el CIF de la empresa? es un viaje de trabajo»
- «Preciso da fatura com o NIF da empresa.»

## Diferencias por mercado

- **es**: se pide el NIF de la empresa.
- **pt**: se pide el NIF (número de contribuinte) de la empresa.
- **it**: se pide la Partita IVA y, si la tiene, el código de destinatario o la PEC para la factura electrónica.
- **fr**: se pide el número SIRET o el número de IVA intracomunitario.
