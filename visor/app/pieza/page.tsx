"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { avisarDeCambio, DatosPropuesta, DetallePieza, EntradaDeVersion, pedir, useDatos } from "@/api";
import { Diferencias } from "@/componentes/Diferencias";
import { Markdown } from "@/componentes/Markdown";
import { enlaceAPieza, fecha, humanizar, MODOS, TIPOS } from "@/textos";
import { useUsuario } from "@/usuario";

function Historial({ pieza }: { pieza: DetallePieza }) {
  const { nombreDe } = useUsuario();
  const { datos: versiones } = useDatos<EntradaDeVersion[]>(`/historial?ruta=${encodeURIComponent(pieza.ruta)}`);
  const [elegida, setElegida] = useState<number | null>(null);
  const [diferencias, setDiferencias] = useState<string | null>(null);
  const indice = versiones?.findIndex((version) => version.version === elegida) ?? -1;
  const anterior = versiones && indice >= 0 ? versiones[indice + 1] : undefined;

  useEffect(() => {
    if (versiones && elegida === null && versiones[0]?.version) setElegida(versiones[0].version);
  }, [versiones, elegida]);

  useEffect(() => {
    if (elegida === null) return;
    if (!anterior?.version) {
      setDiferencias(null);
      return;
    }
    pedir<{ diferencias: string }>(`/diferencias?ruta=${encodeURIComponent(pieza.ruta)}&desde=${anterior.version}&hasta=${elegida}`).then(
      (respuesta) => setDiferencias(respuesta.diferencias),
      () => setDiferencias(null),
    );
  }, [elegida, anterior?.version, pieza.ruta]);

  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <List dense sx={{ width: 300, flexShrink: 0, border: 1, borderColor: "divider", borderRadius: 1 }}>
        {versiones?.map((version) => (
          <ListItemButton key={version.commit} selected={version.version === elegida} onClick={() => setElegida(version.version)}>
            <ListItemText
              primary={`Versión ${version.version ?? "?"}${version.propuesta ? ` · propuesta #${version.propuesta.id}` : ""}`}
              secondary={`${fecha(version.fecha)} · publicó ${nombreDe(version.publicadaPor)}${version.propuesta ? ` · propuso ${nombreDe(version.propuesta.autor)}` : ""}`}
            />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {elegida !== null && (
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontWeight: 600 }}>
                {anterior?.version ? `Qué cambió en la versión ${elegida} respecto a la ${anterior.version}` : `Versión ${elegida}: la primera de esta pieza`}
              </Typography>
              <Box sx={{ flex: 1 }} />
              {versiones?.[0]?.version !== elegida && (
                <Button size="small" variant="outlined" component={Link} href={`/editar?ruta=${encodeURIComponent(pieza.ruta)}&desdeVersion=${elegida}`}>
                  Proponer volver a esta versión
                </Button>
              )}
            </Stack>
            {diferencias !== null && <Diferencias texto={diferencias} />}
            {anterior?.version === undefined && <Typography color="text.secondary">Es la versión con la que se cargó.</Typography>}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

function DialogoDeBorrado({ pieza, abierto, cerrar }: { pieza: DetallePieza; abierto: boolean; cerrar: () => void }) {
  const { usuario } = useUsuario();
  const router = useRouter();
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const rutas = pieza.rutaPruebas ? [pieza.ruta, pieza.rutaPruebas] : [pieza.ruta];

  const proponer = async () => {
    try {
      const { propuesta } = await pedir<{ propuesta: DatosPropuesta }>("/propuestas", {
        metodo: "POST",
        usuario: usuario?.id,
        cuerpo: { titulo: `Borra ${pieza.tipo === "caso" ? humanizar(pieza.titulo) : pieza.titulo}`, descripcion: motivo, cambios: rutas.map((ruta) => ({ ruta, contenido: null })) },
      });
      avisarDeCambio();
      router.push(`/propuestas/${propuesta.id}`);
    } catch (fallo) {
      setError((fallo as Error).message);
    }
  };

  return (
    <Dialog open={abierto} onClose={cerrar} fullWidth maxWidth="sm">
      <DialogTitle>Proponer borrar</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>Se crea una propuesta que borra {rutas.join(" y ")}. No se borra nada hasta que se apruebe y se publique.</Typography>
        <TextField label="Por qué" fullWidth multiline minRows={2} value={motivo} onChange={(evento) => setMotivo(evento.target.value)} />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={cerrar}>Cancelar</Button>
        <Button variant="contained" color="error" onClick={proponer} disabled={!usuario}>
          Proponer borrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Contenido() {
  const parametros = useSearchParams();
  const ruta = parametros.get("ruta") ?? "";
  const ref = parametros.get("ref") ?? undefined;
  const { nombreDe } = useUsuario();
  const { datos: pieza, error } = useDatos<DetallePieza>(ruta ? `/pieza?ruta=${encodeURIComponent(ruta)}${ref ? `&ref=${encodeURIComponent(ref)}` : ""}` : null);
  const [pestana, setPestana] = useState("contenido");
  const [borrando, setBorrando] = useState(false);

  useEffect(() => setPestana("contenido"), [ruta]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!pieza) return null;
  const esCaso = pieza.tipo === "caso";
  const editable = !ref;

  return (
    <Stack spacing={2} sx={{ maxWidth: 1100 }}>
      {ref && <Alert severity="info">Estás viendo cómo queda en {ref}, no lo publicado.</Alert>}
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          {pieza.ruta}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {esCaso ? humanizar(pieza.titulo) : pieza.titulo}
          </Typography>
          <Chip label={TIPOS[pieza.tipo]} />
          {pieza.modo && <Chip variant="outlined" color={MODOS[pieza.modo]?.color} label={MODOS[pieza.modo]?.texto ?? pieza.modo} />}
          {pieza.tipo === "aviso" && <Chip variant="outlined" label={`Del ${pieza.desde} al ${pieza.hasta}`} />}
          <Box sx={{ flex: 1 }} />
          {editable && pieza.tipo === "area" && (
            <Button component={Link} href={`/editar?nuevo=caso&area=${pieza.area}`}>
              Nuevo caso en esta área
            </Button>
          )}
          {editable && (
            <Button variant="contained" startIcon={<EditIcon />} component={Link} href={`/editar?ruta=${encodeURIComponent(pieza.ruta)}`}>
              Editar
            </Button>
          )}
          {editable && !["formato", "responsables", "agente"].includes(pieza.tipo) && (
            <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={() => setBorrando(true)}>
              Borrar
            </Button>
          )}
        </Stack>
        {pieza.descripcion && <Typography sx={{ mt: 1, maxWidth: 800 }}>{pieza.descripcion}</Typography>}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Aprueban los cambios: {pieza.responsables.map(nombreDe).join(" o ") || "nadie (revisa responsables.yml)"}
        </Typography>
      </Box>

      <Tabs value={pestana} onChange={(_evento, valor) => setPestana(valor)}>
        <Tab value="contenido" label="Contenido" />
        {esCaso && <Tab value="pruebas" label={`Pruebas (${pieza.pruebas?.length ?? 0})`} />}
        {(esCaso || pieza.citadaPor.length > 0) && <Tab value="relaciones" label={esCaso ? `Lo que usa (${pieza.citas.length})` : `La usan (${pieza.citadaPor.length})`} />}
        <Tab value="fichero" label="Fichero" />
        {!ref && <Tab value="historial" label="Historial" />}
      </Tabs>

      <Paper sx={{ p: 2.5 }}>
        {pestana === "contenido" &&
          (pieza.tipo === "responsables" ? (
            <Box component="pre" sx={{ m: 0, fontSize: 13 }}>
              {pieza.contenido}
            </Box>
          ) : (
            <Markdown texto={pieza.cuerpo || "_Sin texto._"} />
          ))}
        {pestana === "pruebas" && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Pregunta</TableCell>
                <TableCell>Reserva de prueba</TableCell>
                <TableCell>Mercado</TableCell>
                <TableCell>Respuesta esperada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pieza.pruebas?.map((prueba, indice) => (
                <TableRow key={indice}>
                  <TableCell>{prueba.pregunta}</TableCell>
                  <TableCell>{prueba.reserva}</TableCell>
                  <TableCell>{prueba.mercado ?? "es"}</TableCell>
                  <TableCell>{prueba.esperado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {pestana === "relaciones" && (
          <List dense>
            {(esCaso
              ? pieza.citas.map((cita) => ({ ruta: cita.ruta, titulo: cita.titulo, detalle: `${TIPOS[cita.tipo]} · ${cita.nombre}${cita.existe ? "" : " · no existe"}` }))
              : pieza.citadaPor.map((caso) => ({ ruta: caso.ruta, titulo: humanizar(caso.titulo), detalle: caso.descripcion ?? "" }))
            ).map((elemento) => (
              <ListItemButton key={elemento.ruta} component={Link} href={enlaceAPieza(elemento.ruta)}>
                <ListItemText primary={elemento.titulo} secondary={elemento.detalle} />
              </ListItemButton>
            ))}
          </List>
        )}
        {pestana === "fichero" && (
          <Box component="pre" sx={{ m: 0, fontSize: 12.5, whiteSpace: "pre-wrap", fontFamily: "ui-monospace, Menlo, monospace" }}>
            {pieza.contenido}
          </Box>
        )}
        {pestana === "historial" && <Historial pieza={pieza} />}
      </Paper>
      {pieza.rutaCaso && (
        <Typography>
          Estas pruebas son del caso <Link href={enlaceAPieza(pieza.rutaCaso)}>{pieza.caso}</Link>.
        </Typography>
      )}
      <DialogoDeBorrado pieza={pieza} abierto={borrando} cerrar={() => setBorrando(false)} />
    </Stack>
  );
}

export default function PaginaDePieza() {
  return (
    <Suspense>
      <Contenido />
    </Suspense>
  );
}
