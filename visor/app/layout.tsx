import type { Metadata } from "next";
import { Marco } from "@/componentes/Marco";
import { RegistroDeTema } from "@/RegistroDeTema";
import { ProveedorDeUsuario } from "@/usuario";

export const metadata: Metadata = {
  title: "Conocimiento de Travis",
  description: "Prueba desechable: visor y circuito de cambios del conocimiento de Travis sobre un git propio.",
};

export default function Raiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <RegistroDeTema>
          <ProveedorDeUsuario>
            <Marco>{children}</Marco>
          </ProveedorDeUsuario>
        </RegistroDeTema>
      </body>
    </html>
  );
}
