"use client";

import AddIcon from "@mui/icons-material/Add";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { EntradaDelIndice, ResumenPieza, useDatos } from "@/api";
import { enlaceAPieza } from "@/textos";

export default function Inicio() {
  const { datos: indice, error } = useDatos<EntradaDelIndice[]>("/indice-de-areas");
  const { datos: avisos } = useDatos<ResumenPieza[]>("/avisos-vigentes");
  const { datos: piezas } = useDatos<ResumenPieza[]>("/piezas");
  const cuenta = (tipo: string) => piezas?.filter((pieza) => pieza.tipo === tipo).length ?? 0;

  return (
    <Stack spacing={3} sx={{ maxWidth: 1100 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Lo que sabe Travis
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 760 }}>
          Esto es lo publicado: lo que lee el agente. Cualquier cambio entra como propuesta, la prueba quien la hace, la aprueba un responsable de la carpeta y
          se publica como versión nueva. El agente sabe siempre con qué versión ha contestado.
        </Typography>
        {piezas && (
          <Typography sx={{ mt: 1.5 }}>
            {cuenta("caso")} casos · {cuenta("informacion")} de información · {cuenta("plantilla")} plantillas · {cuenta("accion")} acciones · {cuenta("aviso")} avisos
          </Typography>
        )}
      </Box>

      {error && <Alert severity="error">No se puede leer el conocimiento: {error}. ¿Está arrancada la API?</Alert>}

      <Paper sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <WarningAmberIcon color="warning" fontSize="small" />
          <Typography sx={{ fontWeight: 600 }}>Avisos vigentes hoy</Typography>
          <Box sx={{ flex: 1 }} />
          <Button size="small" startIcon={<AddIcon />} component={Link} href="/editar?nuevo=aviso">
            Nuevo aviso
          </Button>
        </Stack>
        {avisos?.length === 0 && <Typography color="text.secondary">No hay avisos vigentes.</Typography>}
        {avisos?.map((aviso) => (
          <Typography key={aviso.ruta} sx={{ py: 0.5 }}>
            <Link href={enlaceAPieza(aviso.ruta)}>{aviso.titulo}</Link>{" "}
            <Typography component="span" color="text.secondary">
              hasta el {aviso.hasta}
            </Typography>
          </Typography>
        ))}
      </Paper>

      <Paper>
        <Stack direction="row" alignItems="center" sx={{ p: 2, pb: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 600 }}>Índice de áreas</Typography>
            <Typography variant="caption" color="text.secondary">
              Se genera solo a partir de los AREA.md. Es lo primero que lee el agente para elegir dónde buscar el caso.
            </Typography>
          </Box>
        </Stack>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Área</TableCell>
              <TableCell>Qué cubre</TableCell>
              <TableCell align="right">Casos</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {indice?.map((entrada) => (
              <TableRow key={entrada.area} hover>
                <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                  <Link href={enlaceAPieza(`agentes/${entrada.agente}/casos/${entrada.area}/AREA.md`)}>{entrada.titulo}</Link>
                </TableCell>
                <TableCell>{entrada.descripcion}</TableCell>
                <TableCell align="right">{entrada.casos}</TableCell>
                <TableCell align="right">
                  <Button size="small" startIcon={<AddIcon />} component={Link} href={`/editar?nuevo=caso&area=${entrada.area}`}>
                    Caso
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
