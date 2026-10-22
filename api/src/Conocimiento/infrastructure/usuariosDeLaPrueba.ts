import { Usuario } from "../domain/Usuario";

// Usuarios inventados: la prueba no tiene login, se elige quién eres en el visor.
export const USUARIOS_DE_LA_PRUEBA: Usuario[] = [
  { id: "booking-1", nombre: "Agente de booking 1", rol: "Agente de booking" },
  { id: "booking-2", nombre: "Agente de booking 2", rol: "Agente de booking, responsable de casos e información" },
  { id: "resp-booking", nombre: "Responsable de booking", rol: "Responsable de booking" },
  { id: "tecnico-1", nombre: "Técnico 1", rol: "Tecnología" },
  { id: "tecnico-2", nombre: "Técnico 2", rol: "Tecnología" },
  { id: "ia", nombre: "Claude por MCP", rol: "IA: propone, nunca aprueba ni publica", esIA: true },
];
