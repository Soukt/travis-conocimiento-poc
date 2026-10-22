"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { avisarDeCambio, DetallePropuesta, pedir, useDatos } from "@/api";
import { Diferencias } from "@/componentes/Diferencias";
import { enlaceAPieza, ESTADOS, fecha } from "@/textos";
import { useUsuario } from "@/usuario";

function Paso({ hecho, info, titulo, children }: { hecho: boolean; info?: boolean; titulo: string; children?: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ py: 1 }}>
      {info ? <InfoOutlinedIcon color="disabled" /> : hecho ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon color="warning" />}
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: 600 }}>{titulo}</Typography>
        {children}
      </Box>
    </Stack>
  );
}

export default function DetalleDePropuesta() {
  const { id } = useParams<{ id: string }>();
  const { usuario, nombreDe } = useUsuario();
  const { datos: detalle, error: errorDeCarga, recargar } = useDatos<DetallePropuesta>(`/propuestas/${id}`);
  const [error, setError] = useState<string | null>(null);
  const [rechazando, setRechazando] = useState(false);
  const [motivo, setMotivo] = useState("");

  if (errorDeCarga) return <Alert severity="error">{errorDeCarga}</Alert>;
  if (!detalle || !usuario) return null;
  const { propuesta, ficheros, problemas, pendientes, pruebasAutomaticas } = detalle;
  const abierta = propuesta.estado === "abierta";
  const esAutor = usuario.id === propuesta.autor;
  const aprobadores = new Set(propuesta.aprobaciones.map((aprobacion) => aprobacion.usuario));
  const esResponsable = ficheros.some((fichero) => fichero.responsables.includes(usuario.id));
  const puedeProbar = abierta && !propuesta.probadaPor && (propuesta.autorEsIA ? !usuario.esIA : esAutor);
  const puedeAprobar = abierta && !esAutor && esResponsable && !aprobadores.has(usuario.id);
  const puedeRechazar = abierta && (esAutor || esResponsable);

  const accion = async (ruta: string, cuerpo?: unknown) => {
    try {
      setError(null);
      await pedir(`/propuestas/${propuesta.id}/${ruta}`, { metodo: "POST", usuario: usuario.id, cuerpo });
      avisarDeCambio();
      recargar();
    } catch (fallo) {
      setError((fallo as Error).message);
    }
  };

  return (
    <Stack spacing={2.5} sx={{ maxWidth: 1150 }}>
      <Box>
        <Typography variant="caption" color="text.secondary">
          <Link href="/propuestas">Propuestas</Link> · rama {propuesta.rama} · sale de {propuesta.base.slice(0, 7)}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            #{propuesta.id} {propuesta.titulo}
          </Typography>
          <Chip color={ESTADOS[propuesta.estado].color} label={ESTADOS[propuesta.estado].texto} />
          {propuesta.origen === "mcp" && <Chip color="secondary" variant="outlined" label="Llegó por MCP" />}
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Propuesta por {nombreDe(propuesta.autor)} el {fecha(propuesta.creadaEn)}
        </Typography>
        {propuesta.descripcion && <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>{propuesta.descripcion}</Typography>}
      </Box>

      {propuesta.estado === "publicada" && (
        <Alert severity="success">
          Publicada como versión {propuesta.version} por {nombreDe(propuesta.publicadaPor ?? "")} el {fecha(propuesta.publicadaEn)}. Es lo que lee el agente desde entonces.
        </Alert>
      )}
      {propuesta.rechazo && (
        <Alert severity="info">
          {propuesta.rechazo.usuario === propuesta.autor ? "Retirada" : "Rechazada"} por {nombreDe(propuesta.rechazo.usuario)}: {propuesta.rechazo.motivo}
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>
          {abierta ? (pendientes.length === 0 ? "Lista para publicar" : "Qué falta para publicar") : "Circuito"}
        </Typography>
        <Paso hecho={problemas.length === 0} titulo={problemas.length === 0 ? "El formato es correcto" : `El formato tiene ${problemas.length} problemas`}>
          {problemas.map((problema, indice) => (
            <Typography key={indice} color="text.secondary">
              <code>{problema.ruta}</code> {problema.mensaje}
            </Typography>
          ))}
        </Paso>
        <Paso hecho={Boolean(propuesta.probadaPor)} titulo={propuesta.probadaPor ? `Probada en Travis por ${nombreDe(propuesta.probadaPor)}` : "Falta que la pruebe quien la hizo"}>
          <Typography color="text.secondary">
            {propuesta.autorEsIA
              ? "La propuso la IA: la tiene que probar una persona."
              : "En esta prueba no hay Travis. Marcarla simula que quien hizo el cambio lo ha probado con el agente leyendo esta rama."}
          </Typography>
        </Paso>
        <Paso hecho={false} info titulo="Pruebas automáticas: no disponibles en esta prueba">
          <Typography color="text.secondary">{pruebasAutomaticas.motivo}</Typography>
          {pruebasAutomaticas.casos.map((caso) => (
            <Typography key={caso.ruta} color="text.secondary">
              Se lanzarían las {caso.pruebas} pruebas de <Link href={enlaceAPieza(caso.ruta, propuesta.rama)}>{caso.caso}</Link>
            </Typography>
          ))}
        </Paso>
        {ficheros.map((fichero) => {
          const quien = fichero.responsables.find((responsable) => aprobadores.has(responsable));
          return (
            <Paso key={fichero.ruta} hecho={Boolean(quien)} titulo={quien ? `Aprobado por ${nombreDe(quien)}` : `Falta la aprobación de ${fichero.responsables.map(nombreDe).join(" o ")}`}>
              <Typography color="text.secondary">
                <code>{fichero.ruta}</code>
              </Typography>
            </Paso>
          );
        })}

        {abierta && (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {puedeProbar && (
              <Button variant="outlined" onClick={() => accion("probada")}>
                Lo he probado en Travis
              </Button>
            )}
            {puedeAprobar && (
              <Button variant="outlined" color="success" onClick={() => accion("aprobar")}>
                Aprobar
              </Button>
            )}
            <Button variant="contained" disabled={pendientes.length > 0 || usuario.esIA} onClick={() => accion("publicar")}>
              Publicar
            </Button>
            <Box sx={{ flex: 1 }} />
            {puedeRechazar && (
              <Button color="error" onClick={() => setRechazando(true)}>
                {esAutor ? "Retirar" : "Rechazar"}
              </Button>
            )}
          </Stack>
        )}
        {abierta && esAutor && !propuesta.autorEsIA && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            No puedes aprobar tu propia propuesta. Cambia de usuario arriba para hacer de responsable.
          </Typography>
        )}
      </Paper>

      <Box>
        <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>
          Cambios ({ficheros.length})
        </Typography>
        {ficheros.map((fichero) => (
          <Accordion key={fichero.ruta} defaultExpanded={ficheros.length <= 3} disableGutters variant="outlined">
            <AccordionSummary>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
                <Chip label={fichero.cambio === "nuevo" ? "Nuevo" : fichero.cambio === "borrado" ? "Borrado" : "Cambiado"} color={fichero.cambio === "borrado" ? "error" : fichero.cambio === "nuevo" ? "success" : "default"} />
                <Typography sx={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13 }}>{fichero.ruta}</Typography>
                <Box sx={{ flex: 1 }} />
                {fichero.cambio !== "borrado" && (
                  <Button size="small" component={Link} href={enlaceAPieza(fichero.ruta, propuesta.rama)} onClick={(evento) => evento.stopPropagation()}>
                    Ver cómo queda
                  </Button>
                )}
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Diferencias texto={fichero.diferencias} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Dialog open={rechazando} onClose={() => setRechazando(false)} fullWidth maxWidth="sm">
        <DialogTitle>{esAutor ? "Retirar la propuesta" : "Rechazar la propuesta"}</DialogTitle>
        <DialogContent>
          <TextField label="Motivo" fullWidth multiline minRows={3} value={motivo} onChange={(evento) => setMotivo(evento.target.value)} sx={{ mt: 1 }} autoFocus />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRechazando(false)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            disabled={motivo.trim().length === 0}
            onClick={async () => {
              setRechazando(false);
              await accion("rechazar", { motivo });
            }}
          >
            {esAutor ? "Retirar" : "Rechazar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
