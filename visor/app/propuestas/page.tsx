"use client";

import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DatosPropuesta, useDatos } from "@/api";
import { ESTADOS, fecha } from "@/textos";
import { useUsuario } from "@/usuario";

export default function Propuestas() {
  const router = useRouter();
  const { nombreDe } = useUsuario();
  const { datos: propuestas } = useDatos<DatosPropuesta[]>("/propuestas");
  const [filtro, setFiltro] = useState<"abierta" | "publicada" | "rechazada" | "todas">("abierta");
  const visibles = propuestas?.filter((propuesta) => filtro === "todas" || propuesta.estado === filtro) ?? [];

  return (
    <Stack spacing={2} sx={{ maxWidth: 1200 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Propuestas
      </Typography>
      <Typography color="text.secondary">Cada propuesta es una rama del git del conocimiento. Hasta que se publica, el agente sigue leyendo la versión anterior.</Typography>
      <Tabs value={filtro} onChange={(_evento, valor) => setFiltro(valor)}>
        <Tab value="abierta" label="Abiertas" />
        <Tab value="publicada" label="Publicadas" />
        <Tab value="rechazada" label="Rechazadas" />
        <Tab value="todas" label="Todas" />
      </Tabs>
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Qué cambia</TableCell>
              <TableCell>Propuesta por</TableCell>
              <TableCell>Ficheros</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Creada</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibles.map((propuesta) => (
              <TableRow key={propuesta.id} hover sx={{ cursor: "pointer" }} onClick={() => router.push(`/propuestas/${propuesta.id}`)}>
                <TableCell>{propuesta.id}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{propuesta.titulo}</TableCell>
                <TableCell>
                  {nombreDe(propuesta.autor)} {propuesta.origen === "mcp" && <Chip color="secondary" variant="outlined" label="por MCP" sx={{ ml: 0.5 }} />}
                </TableCell>
                <TableCell>{propuesta.ficheros.length}</TableCell>
                <TableCell>
                  <Chip color={ESTADOS[propuesta.estado].color} label={propuesta.version ? `${ESTADOS[propuesta.estado].texto} · v${propuesta.version}` : ESTADOS[propuesta.estado].texto} />
                </TableCell>
                <TableCell>{fecha(propuesta.creadaEn)}</TableCell>
              </TableRow>
            ))}
            {visibles.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">No hay propuestas aquí.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
