"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { tema } from "./tema";

// Patrón de MUI para el App Router: recoge los estilos de emotion del render en servidor y los inyecta en el HTML.
export function RegistroDeTema({ children }: { children: React.ReactNode }) {
  const [{ cache, vaciar }] = useState(() => {
    const cache = createCache({ key: "mui" });
    cache.compat = true;
    const insertarOriginal = cache.insert;
    let insertados: string[] = [];
    cache.insert = (...argumentos) => {
      const serializado = argumentos[1];
      if (cache.inserted[serializado.name] === undefined) insertados.push(serializado.name);
      return insertarOriginal(...argumentos);
    };
    const vaciar = () => {
      const anteriores = insertados;
      insertados = [];
      return anteriores;
    };
    return { cache, vaciar };
  });

  useServerInsertedHTML(() => {
    const nombres = vaciar();
    if (nombres.length === 0) return null;
    const estilos = nombres.map((nombre) => cache.inserted[nombre]).join("");
    return <style key={cache.key} data-emotion={`${cache.key} ${nombres.join(" ")}`} dangerouslySetInnerHTML={{ __html: estilos }} />;
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={tema}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
