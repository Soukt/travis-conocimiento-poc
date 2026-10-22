"use client";

import HistoryIcon from "@mui/icons-material/History";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DatosPropuesta, useDatos } from "../api";
import { useUsuario } from "../usuario";
import { ArbolDeConocimiento } from "./ArbolDeConocimiento";

const ANCHO_DEL_ARBOL = 330;

export function Marco({ children }: { children: React.ReactNode }) {
  const { usuario, usuarios, elegir } = useUsuario();
  const ruta = usePathname();
  const { datos: version } = useDatos<{ version: number }>("/version");
  const { datos: propuestas } = useDatos<DatosPropuesta[]>("/propuestas");
  const abiertas = propuestas?.filter((propuesta) => propuesta.estado === "abierta").length ?? 0;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", zIndex: (tema) => tema.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography component={Link} href="/" variant="h6" sx={{ fontWeight: 700, fontSize: 17, color: "text.primary", textDecoration: "none" }}>
            Conocimiento de Travis
          </Typography>
          {version && <Chip color="secondary" label={`Publicada: versión ${version.version}`} />}
          <Chip variant="outlined" label="Prueba · contenido simulado" />
          <Box sx={{ flex: 1 }} />
          <Button component={Link} href="/propuestas" color={ruta.startsWith("/propuestas") ? "primary" : "inherit"} startIcon={<Badge badgeContent={abiertas} color="primary"><InboxIcon /></Badge>}>
            Propuestas
          </Button>
          <Button component={Link} href="/historial" color={ruta === "/historial" ? "primary" : "inherit"} startIcon={<HistoryIcon />}>
            Versiones
          </Button>
          <Typography color="text.secondary">Soy</Typography>
          <Select size="small" value={usuario?.id ?? ""} onChange={(evento) => elegir(String(evento.target.value))} sx={{ minWidth: 230 }} displayEmpty>
            {usuarios
              .filter((candidato) => !candidato.esIA)
              .map((candidato) => (
                <MenuItem key={candidato.id} value={candidato.id}>
                  <Box>
                    <Typography>{candidato.nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {candidato.rol}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
          </Select>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: ANCHO_DEL_ARBOL, flexShrink: 0, "& .MuiDrawer-paper": { width: ANCHO_DEL_ARBOL, boxSizing: "border-box" } }}>
        <Toolbar />
        <ArbolDeConocimiento />
      </Drawer>
      <Box component="main" sx={{ flex: 1, minWidth: 0, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
