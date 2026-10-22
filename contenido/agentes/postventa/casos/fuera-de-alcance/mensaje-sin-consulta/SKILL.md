---
name: mensaje-sin-consulta
description: El mensaje del cliente no dice qué necesita, por ejemplo un saludo, solo un localizador o un adjunto sin texto. El agente pide lo que falta.
metadata:
  titulo: Mensaje sin consulta
  area: fuera-de-alcance
  modo: autonomo
  acciones:
    - pedir-datos-cliente
    - crear-ticket-booking
  plantillas:
    - pedir-datos-que-faltan
  simulado: "true"
---
## Cuándo aplica

- El mensaje no dice qué necesita el cliente: un saludo, un «urgente» sin más, solo un localizador o un adjunto sin texto.
- El mensaje está cortado o no se entiende.

## Qué hace el agente

1. Contesta en la primera respuesta con la plantilla `pedir-datos-que-faltan`.
2. Si no los ha dado, pide el localizador y el email de la reserva con `pedir-datos-cliente`.
3. Le pide que cuente en pocas palabras qué necesita.
4. Cuando el cliente contesta, busca el caso que encaja.

## Qué no hace

- No adivina qué quiere el cliente.
- No da datos de ninguna reserva hasta saber qué necesita y haber comprobado su identidad.
- No abre un ticket solo por un saludo.

## Cuándo pasa a una persona

- Si después de pedírselo el cliente vuelve a escribir sin decir qué necesita, crea un ticket con `crear-ticket-booking` con todos sus mensajes.

## Cómo lo puede pedir el cliente

- «Hola»
- «urgente porfa»
- «Te envio la foto» (con un adjunto y nada más)
- «Olá, boa tarde»
