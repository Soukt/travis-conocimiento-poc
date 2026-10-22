"use client";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { pedir, ResultadoDeBusqueda, ResumenPieza, useDatos } from "../api";
import { enlaceAPieza, humanizar, MODOS, TIPOS } from "../textos";

type Grupo = { clave: string; titulo: string; piezas: ResumenPieza[]; cabecera?: ResumenPieza };

function agrupar(piezas: ResumenPieza[], hoy: string): Array<{ seccion: string; grupos: Grupo[] }> {
  const deTipo = (tipo: string) => piezas.filter((pieza) => pieza.tipo === tipo);
  const areas = deTipo("area").map((area) => ({
    clave: `area:${area.area}`,
    titulo: area.titulo,
    cabecera: area,
    piezas: deTipo("caso").filter((caso) => caso.area === area.area && caso.agente === area.agente),
  }));
  const gruposDeInformacion = [...new Set(deTipo("informacion").map((pieza) => pieza.ruta.split("/")[1]))].map((grupo) => ({
    clave: `info:${grupo}`,
    titulo: humanizar(grupo),
    piezas: deTipo("informacion").filter((pieza) => pieza.ruta.split("/")[1] === grupo),
  }));
  const avisos = deTipo("aviso").map((aviso) => ({ ...aviso, caducado: (aviso.hasta ?? "") < hoy }));
  return [
    { seccion: "Agente de postventa", grupos: [{ clave: "agente", titulo: "Reglas del agente", piezas: deTipo("agente") }, ...areas] },
    { seccion: "Información", grupos: gruposDeInformacion },
    {
      seccion: "Resto",
      grupos: [
        { clave: "avisos", titulo: "Avisos", piezas: avisos },
        { clave: "plantillas", titulo: "Plantillas", piezas: deTipo("plantilla") },
        { clave: "acciones", titulo: "Acciones", piezas: deTipo("accion") },
        { clave: "ajustes", titulo: "Formato y responsables", piezas: [...deTipo("formato"), ...deTipo("responsables")] },
      ],
    },
  ];
}

function Contenido() {
  const parametros = useSearchParams();
  const seleccionada = parametros.get("ruta");
  const { datos: piezas } = useDatos<ResumenPieza[]>("/piezas");
  const [abiertos, setAbiertos] = useState<Record<string, boolean>>({ agente: true });
  const [consulta, setConsulta] = useState("");
  const [resultados, setResultados] = useState<ResultadoDeBusqueda[] | null>(null);
  const hoy = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Madrid" }).format(new Date());

  useEffect(() => {
    if (consulta.trim().length < 2) {
      setResultados(null);
      return;
    }
    const espera = setTimeout(() => {
      pedir<ResultadoDeBusqueda[]>(`/buscar?texto=${encodeURIComponent(consulta)}`).then(setResultados, () => setResultados([]));
    }, 250);
    return () => clearTimeout(espera);
  }, [consulta]);

  useEffect(() => {
    const pieza = piezas?.find((candidata) => candidata.ruta === seleccionada);
    if (pieza?.area) setAbiertos((anteriores) => ({ ...anteriores, [`area:${pieza.area}`]: true }));
  }, [piezas, seleccionada]);

  const alternar = (clave: string) => setAbiertos((anteriores) => ({ ...anteriores, [clave]: !anteriores[clave] }));

  return (
    <Box sx={{ overflow: "auto" }}>
      <Box sx={{ p: 2, pb: 1 }}>
        <TextField size="small" fullWidth placeholder="Buscar en todo el conocimiento" value={consulta} onChange={(evento) => setConsulta(evento.target.value)} />
      </Box>
      {resultados ? (
        <List dense>
          <ListSubheader>{resultados.length} resultados</ListSubheader>
          {resultados.map((resultado) => (
            <ListItemButton key={resultado.ruta} component={Link} href={enlaceAPieza(resultado.ruta)} selected={resultado.ruta === seleccionada}>
              <ListItemText
                primary={resultado.tipo === "caso" ? humanizar(resultado.titulo) : resultado.titulo}
                secondary={
                  <>
                    <Typography component="span" variant="caption" color="secondary.dark">
                      {TIPOS[resultado.tipo]}
                    </Typography>{" "}
                    {resultado.fragmento}
                  </>
                }
                secondaryTypographyProps={{ sx: { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } }}
              />
            </ListItemButton>
          ))}
        </List>
      ) : (
        piezas &&
        agrupar(piezas, hoy).map(({ seccion, grupos }) => (
          <List key={seccion} dense subheader={<ListSubheader sx={{ lineHeight: "32px" }}>{seccion}</ListSubheader>}>
            {grupos.map((grupo) => (
              <Box key={grupo.clave}>
                <ListItemButton onClick={() => alternar(grupo.clave)}>
                  <ListItemText primary={grupo.titulo} primaryTypographyProps={{ fontWeight: 600 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                    {grupo.piezas.length}
                  </Typography>
                  {abiertos[grupo.clave] ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </ListItemButton>
                <Collapse in={Boolean(abiertos[grupo.clave])} unmountOnExit>
                  <List dense disablePadding>
                    {grupo.cabecera && (
                      <ListItemButton sx={{ pl: 4 }} component={Link} href={enlaceAPieza(grupo.cabecera.ruta)} selected={grupo.cabecera.ruta === seleccionada}>
                        <ListItemText primary="Qué cubre el área" primaryTypographyProps={{ fontStyle: "italic", color: "text.secondary" }} />
                      </ListItemButton>
                    )}
                    {grupo.piezas.map((pieza) => (
                      <ListItemButton key={pieza.ruta} sx={{ pl: 4 }} component={Link} href={enlaceAPieza(pieza.ruta)} selected={pieza.ruta === seleccionada}>
                        <ListItemText primary={pieza.tipo === "caso" ? humanizar(pieza.titulo) : pieza.titulo} />
                        {pieza.modo && <Chip variant="outlined" color={MODOS[pieza.modo]?.color} label={MODOS[pieza.modo]?.texto ?? pieza.modo} sx={{ height: 18, fontSize: 10.5 }} />}
                        {"caducado" in pieza && (
                          <Chip
                            variant="outlined"
                            color={pieza.caducado ? "default" : "warning"}
                            label={pieza.caducado ? "Caducado" : "Vigente"}
                            sx={{ height: 18, fontSize: 10.5 }}
                          />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ))}
          </List>
        ))
      )}
    </Box>
  );
}

export function ArbolDeConocimiento() {
  return (
    <Suspense>
      <Contenido />
    </Suspense>
  );
}
