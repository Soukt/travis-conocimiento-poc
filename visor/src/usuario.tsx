"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { pedir, Usuario } from "./api";

const CLAVE = "travis-usuario";

type ContextoDeUsuario = { usuario: Usuario | null; usuarios: Usuario[]; elegir: (id: string) => void; nombreDe: (id: string) => string };

const Contexto = createContext<ContextoDeUsuario>({ usuario: null, usuarios: [], elegir: () => undefined, nombreDe: (id) => id });

export function ProveedorDeUsuario({ children }: { children: React.ReactNode }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [elegido, setElegido] = useState("booking-1");

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE);
      if (guardado) setElegido(guardado);
    } catch {
      // Sin almacenamiento del navegador se queda el usuario por defecto.
    }
    pedir<Usuario[]>("/usuarios").then(setUsuarios, () => setUsuarios([]));
  }, []);

  const elegir = (id: string) => {
    setElegido(id);
    try {
      window.localStorage.setItem(CLAVE, id);
    } catch {
      // Igual que arriba.
    }
  };

  const usuario = usuarios.find((candidato) => candidato.id === elegido) ?? null;
  const nombreDe = (id: string) => usuarios.find((candidato) => candidato.id === id)?.nombre ?? id;
  return <Contexto.Provider value={{ usuario, usuarios, elegir, nombreDe }}>{children}</Contexto.Provider>;
}

export const useUsuario = () => useContext(Contexto);
