"use client";

import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { EntradaDeVersion, useDatos } from "@/api";
import { fecha } from "@/textos";
import { useUsuario } from "@/usuario";

export default function Versiones() {
  const { nombreDe } = useUsuario();
  const { datos: versiones } = useDatos<EntradaDeVersion[]>("/historial");
  return (
    <Stack spacing={2} sx={{ maxWidth: 1100 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Versiones publicadas
      </Typography>
      <Typography color="text.secondary">
        Cada publicación es una versión nueva del conocimiento. Si Travis contesta algo mal, la versión que apunta en la respuesta dice qué leyó.
      </Typography>
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Versión</TableCell>
              <TableCell>Publicada</TableCell>
              <TableCell>Por</TableCell>
              <TableCell>Propuesta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versiones?.map((version, indice) => (
              <TableRow key={version.commit}>
                <TableCell>
                  <Chip color={indice === 0 ? "secondary" : "default"} label={`v${version.version ?? "?"}`} />
                </TableCell>
                <TableCell>{fecha(version.fecha)}</TableCell>
                <TableCell>{nombreDe(version.publicadaPor)}</TableCell>
                <TableCell>
                  {version.propuesta ? (
                    <>
                      <Link href={`/propuestas/${version.propuesta.id}`}>
                        #{version.propuesta.id} {version.propuesta.titulo}
                      </Link>{" "}
                      <Typography component="span" color="text.secondary">
                        · de {nombreDe(version.propuesta.autor)}
                        {version.propuesta.origen === "mcp" ? " por MCP" : ""}
                      </Typography>
                    </>
                  ) : (
                    version.mensaje
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
