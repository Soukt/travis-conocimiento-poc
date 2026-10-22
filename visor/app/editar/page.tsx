"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { avisarDeCambio, DatosPropuesta, DetallePieza, pedir, Problema, ResumenPieza, TipoPieza, useDatos } from "@/api";
import { Markdown } from "@/componentes/Markdown";
import { aNombre, Cabecera, separar, unir } from "@/fichero";
import { humanizar, MERCADOS, MODOS, TIPOS } from "@/textos";
import { useUsuario } from "@/usuario";

type Borrador = {
  ruta: string;
  tipo: TipoPieza;
  original: string | null;
  cabecera: Cabecera;
  cuerpo: string;
  crudo: string | null;
};

type Catalogo = { acciones: string[]; informacion: string[]; plantillas: string[]; areas: string[]; titulos: Map<string, string> };

const SOLO_TEXTO: TipoPieza[] = ["formato", "responsables"];
const SECCIONES_DE_CASO = ["Cuándo aplica", "Qué hace el agente", "Qué no hace", "Cuándo pasa a una persona", "Cómo lo puede pedir el cliente"];
const GRUPOS_DE_INFORMACION = ["comun", "parques", "hoteles", "vuelos", "ferris", "circuitos"];
const AGENTE = "postventa";

const contenidoDe = (borrador: Borrador) => (borrador.crudo !== null ? borrador.crudo : unir(borrador.cabecera, borrador.cuerpo));

function desdeTexto(ruta: string, tipo: TipoPieza, texto: string | null, original: string | null): Borrador {
  if (texto === null || SOLO_TEXTO.includes(tipo)) return { ruta, tipo, original, cabecera: {}, cuerpo: "", crudo: texto ?? "" };
  const leido = separar(texto);
  if ("error" in leido) return { ruta, tipo, original, cabecera: {}, cuerpo: "", crudo: texto };
  return { ruta, tipo, original, cabecera: leido.cabecera, cuerpo: leido.cuerpo, crudo: null };
}

function nuevos(tipo: string, area: string, nombre: string, titulo: string, grupo: string): Borrador[] {
  const hoy = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Madrid" }).format(new Date());
  if (tipo === "caso") {
    const carpeta = `agentes/${AGENTE}/casos/${area}/${nombre}`;
    return [
      {
        ruta: `${carpeta}/SKILL.md`,
        tipo: "caso",
        original: null,
        crudo: null,
        cabecera: { name: nombre, description: "", metadata: { titulo, area, modo: "copiloto", acciones: ["verificar-identidad"], simulado: "true" } },
        cuerpo: SECCIONES_DE_CASO.map((seccion) => `## ${seccion}\n\n- \n`).join("\n"),
      },
      {
        ruta: `${carpeta}/pruebas.md`,
        tipo: "pruebas",
        original: null,
        crudo: null,
        cabecera: { caso: nombre, pruebas: [{ pregunta: "", reserva: "", mercado: "es", esperado: "" }] },
        cuerpo: "",
      },
    ];
  }
  if (tipo === "informacion") {
    return [{ ruta: `informacion/${grupo}/${nombre}.md`, tipo, original: null, crudo: null, cabecera: { name: nombre, titulo, description: "" }, cuerpo: "## ¿?\n\n" }];
  }
  if (tipo === "aviso") {
    return [{ ruta: `avisos/${nombre}.md`, tipo, original: null, crudo: null, cabecera: { name: nombre, titulo, desde: hoy, hasta: hoy, areas: [] }, cuerpo: "- " }];
  }
  return [{ ruta: `plantillas/${nombre}.md`, tipo: "plantilla", original: null, crudo: null, cabecera: { name: nombre, titulo, description: "" }, cuerpo: "" }];
}

function ListaDelCatalogo({ etiqueta, valor, opciones, titulos, cambiar }: { etiqueta: string; valor: unknown; opciones: string[]; titulos: Map<string, string>; cambiar: (valor: string[]) => void }) {
  const elegidos = Array.isArray(valor) ? (valor as string[]) : [];
  return (
    <Autocomplete
      multiple
      size="small"
      options={opciones}
      value={elegidos}
      onChange={(_evento, nuevo) => cambiar(nuevo)}
      getOptionLabel={(opcion) => opcion}
      renderTags={(valores, propiedadesDeEtiqueta) =>
        valores.map((opcion, indice) => {
          const { key, ...resto } = propiedadesDeEtiqueta({ index: indice });
          return <Chip key={key} label={opcion} {...resto} />;
        })
      }
      renderOption={(propiedades, opcion) => (
        <li {...propiedades} key={opcion}>
          <Box>
            <Typography>{opcion}</Typography>
            {titulos.get(opcion) && (
              <Typography variant="caption" color="text.secondary">
                {titulos.get(opcion)}
              </Typography>
            )}
          </Box>
        </li>
      )}
      renderInput={(parametros) => <TextField {...parametros} label={etiqueta} />}
    />
  );
}

function Cuerpo({ borrador, cambiar }: { borrador: Borrador; cambiar: (cuerpo: string) => void }) {
  const [pestana, setPestana] = useState<"escribir" | "ver">("escribir");
  return (
    <Box>
      <Tabs value={pestana} onChange={(_evento, valor) => setPestana(valor)} sx={{ minHeight: 36, "& .MuiTab-root": { minHeight: 36 } }}>
        <Tab value="escribir" label="Escribir" />
        <Tab value="ver" label="Vista previa" />
      </Tabs>
      {pestana === "escribir" ? (
        <TextField
          fullWidth
          multiline
          minRows={14}
          value={borrador.cuerpo}
          onChange={(evento) => cambiar(evento.target.value)}
          InputProps={{ sx: { fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13 } }}
        />
      ) : (
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2, minHeight: 200 }}>
          <Markdown texto={borrador.cuerpo} />
        </Box>
      )}
    </Box>
  );
}

function Pruebas({ borrador, cambiar }: { borrador: Borrador; cambiar: (cabecera: Cabecera) => void }) {
  const pruebas = (Array.isArray(borrador.cabecera.pruebas) ? borrador.cabecera.pruebas : []) as Array<Record<string, string>>;
  const poner = (indice: number, campo: string, valor: string) =>
    cambiar({ ...borrador.cabecera, pruebas: pruebas.map((prueba, actual) => (actual === indice ? { ...prueba, [campo]: valor } : prueba)) });
  return (
    <Stack spacing={1.5}>
      {pruebas.map((prueba, indice) => (
        <Paper key={indice} sx={{ p: 1.5 }}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Typography sx={{ fontWeight: 600, pt: 1, width: 24 }}>{indice + 1}</Typography>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <TextField size="small" label="Pregunta del cliente" value={prueba.pregunta ?? ""} onChange={(evento) => poner(indice, "pregunta", evento.target.value)} />
              <Stack direction="row" spacing={1}>
                <TextField size="small" label="Reserva de prueba" value={prueba.reserva ?? ""} onChange={(evento) => poner(indice, "reserva", evento.target.value)} sx={{ flex: 1 }} />
                <TextField select size="small" label="Mercado" value={prueba.mercado ?? "es"} onChange={(evento) => poner(indice, "mercado", evento.target.value)} sx={{ width: 110 }}>
                  {MERCADOS.map((mercado) => (
                    <MenuItem key={mercado} value={mercado}>
                      {mercado}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <TextField size="small" multiline label="Qué tiene que contestar" value={prueba.esperado ?? ""} onChange={(evento) => poner(indice, "esperado", evento.target.value)} />
            </Stack>
            <IconButton onClick={() => cambiar({ ...borrador.cabecera, pruebas: pruebas.filter((_prueba, actual) => actual !== indice) })} aria-label="Quitar prueba">
              <DeleteOutlineIcon />
            </IconButton>
          </Stack>
        </Paper>
      ))}
      <Box>
        <Button startIcon={<AddIcon />} onClick={() => cambiar({ ...borrador.cabecera, pruebas: [...pruebas, { pregunta: "", reserva: "", mercado: "es", esperado: "" }] })}>
          Añadir prueba
        </Button>
      </Box>
    </Stack>
  );
}

function Campos({ borrador, catalogo, cambiar }: { borrador: Borrador; catalogo: Catalogo; cambiar: (cabecera: Cabecera) => void }) {
  const cabecera = borrador.cabecera;
  const poner = (campo: string, valor: unknown) => cambiar({ ...cabecera, [campo]: valor });
  const metadata = (cabecera.metadata ?? {}) as Record<string, unknown>;
  const ponerMetadata = (campo: string, valor: unknown) => cambiar({ ...cabecera, metadata: { ...metadata, [campo]: valor } });
  const texto = (valor: unknown) => (typeof valor === "string" ? valor : "");

  if (borrador.tipo === "caso") {
    return (
      <Stack spacing={2}>
        <TextField label="Título para personas" value={texto(metadata.titulo)} onChange={(evento) => ponerMetadata("titulo", evento.target.value)} helperText="Con tildes y como lo diría booking. El agente se guía por la descripción." />
        <TextField label="Cuándo usar este caso (description)" multiline minRows={2} value={texto(cabecera.description)} onChange={(evento) => poner("description", evento.target.value)} helperText="Es lo que lee el agente para decidir si el caso encaja con la pregunta." />
        <TextField select label="Qué hace el agente" value={texto(metadata.modo)} onChange={(evento) => ponerMetadata("modo", evento.target.value)} sx={{ maxWidth: 360 }}>
          {Object.entries(MODOS).map(([valor, modo]) => (
            <MenuItem key={valor} value={valor}>
              {modo.texto}
            </MenuItem>
          ))}
        </TextField>
        <ListaDelCatalogo etiqueta="Acciones que usa" valor={metadata.acciones} opciones={catalogo.acciones} titulos={catalogo.titulos} cambiar={(valor) => ponerMetadata("acciones", valor)} />
        <ListaDelCatalogo etiqueta="Información que cita" valor={metadata.informacion} opciones={catalogo.informacion} titulos={catalogo.titulos} cambiar={(valor) => ponerMetadata("informacion", valor)} />
        <ListaDelCatalogo etiqueta="Plantillas que usa" valor={metadata.plantillas} opciones={catalogo.plantillas} titulos={catalogo.titulos} cambiar={(valor) => ponerMetadata("plantillas", valor)} />
      </Stack>
    );
  }
  if (borrador.tipo === "pruebas") return null;
  return (
    <Stack spacing={2}>
      {"titulo" in cabecera || ["informacion", "aviso", "plantilla", "area"].includes(borrador.tipo) ? (
        <TextField label="Título" value={texto(cabecera.titulo)} onChange={(evento) => poner("titulo", evento.target.value)} />
      ) : null}
      {borrador.tipo !== "aviso" && <TextField label="Descripción" multiline value={texto(cabecera.description)} onChange={(evento) => poner("description", evento.target.value)} />}
      {borrador.tipo === "aviso" && (
        <>
          <Stack direction="row" spacing={2}>
            <TextField type="date" label="Desde" InputLabelProps={{ shrink: true }} value={texto(cabecera.desde)} onChange={(evento) => poner("desde", evento.target.value)} />
            <TextField type="date" label="Hasta" InputLabelProps={{ shrink: true }} value={texto(cabecera.hasta)} onChange={(evento) => poner("hasta", evento.target.value)} helperText="Pasada esta fecha, el agente deja de leerlo." />
          </Stack>
          <ListaDelCatalogo etiqueta="Áreas a las que afecta" valor={cabecera.areas} opciones={catalogo.areas} titulos={catalogo.titulos} cambiar={(valor) => poner("areas", valor)} />
        </>
      )}
      {(borrador.tipo === "aviso" || borrador.tipo === "plantilla") && (
        <ListaDelCatalogo etiqueta="Solo para estos mercados (vacío: todos)" valor={cabecera.mercados} opciones={MERCADOS} titulos={new Map()} cambiar={(valor) => poner("mercados", valor.length ? valor : undefined)} />
      )}
    </Stack>
  );
}

function Editor({ borradores, setBorradores, esNuevo, titulo }: { borradores: Borrador[]; setBorradores: (borradores: Borrador[]) => void; esNuevo: boolean; titulo: string }) {
  const router = useRouter();
  const { usuario } = useUsuario();
  const { datos: piezas } = useDatos<ResumenPieza[]>("/piezas", { alCambiar: false });
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [proponiendo, setProponiendo] = useState(false);
  const [tituloDePropuesta, setTituloDePropuesta] = useState(titulo);
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState<string | null>(null);

  const catalogo = useMemo<Catalogo>(() => {
    const titulos = new Map<string, string>();
    const nombres = (tipo: string, nombre: (pieza: ResumenPieza) => string) =>
      (piezas ?? [])
        .filter((pieza) => pieza.tipo === tipo)
        .map((pieza) => {
          titulos.set(nombre(pieza), pieza.tipo === "accion" ? pieza.descripcion ?? "" : pieza.titulo);
          return nombre(pieza);
        });
    return {
      acciones: nombres("accion", (pieza) => pieza.titulo),
      informacion: nombres("informacion", (pieza) => pieza.ruta.replace(/^informacion\//, "").replace(/\.md$/, "")),
      plantillas: nombres("plantilla", (pieza) => pieza.ruta.replace(/^plantillas\//, "").replace(/\.md$/, "")),
      areas: nombres("area", (pieza) => pieza.area ?? ""),
      titulos,
    };
  }, [piezas]);

  const cambios = borradores.filter((borrador) => contenidoDe(borrador) !== borrador.original).map((borrador) => ({ ruta: borrador.ruta, contenido: contenidoDe(borrador) }));
  const claveDeCambios = JSON.stringify(cambios);

  useEffect(() => {
    if (cambios.length === 0) {
      setProblemas([]);
      return;
    }
    const espera = setTimeout(() => {
      pedir<{ problemas: Problema[] }>("/validar", { metodo: "POST", cuerpo: { cambios } }).then(
        (respuesta) => setProblemas(respuesta.problemas),
        (fallo: Error) => setProblemas([{ ruta: "", mensaje: fallo.message }]),
      );
    }, 500);
    return () => clearTimeout(espera);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claveDeCambios]);

  const actualizar = (indice: number, cambio: Partial<Borrador>) => setBorradores(borradores.map((borrador, actual) => (actual === indice ? { ...borrador, ...cambio } : borrador)));

  const alternarTexto = (indice: number, comoTexto: boolean) => {
    const borrador = borradores[indice];
    if (comoTexto) {
      actualizar(indice, { crudo: contenidoDe(borrador) });
      return;
    }
    const leido = separar(borrador.crudo ?? "");
    if ("error" in leido) {
      setError(leido.error);
      return;
    }
    setError(null);
    actualizar(indice, { crudo: null, cabecera: leido.cabecera, cuerpo: leido.cuerpo });
  };

  const proponer = async () => {
    try {
      const { propuesta } = await pedir<{ propuesta: DatosPropuesta }>("/propuestas", {
        metodo: "POST",
        usuario: usuario?.id,
        cuerpo: { titulo: tituloDePropuesta, descripcion, cambios },
      });
      avisarDeCambio();
      router.push(`/propuestas/${propuesta.id}`);
    } catch (fallo) {
      setError((fallo as Error).message);
      setProponiendo(false);
    }
  };

  return (
    <Stack spacing={2.5} sx={{ maxWidth: 1000 }}>
      {borradores.map((borrador, indice) => (
        <Paper key={indice} sx={{ p: 2.5 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 600 }}>{borrador.tipo === "pruebas" ? "Pruebas del caso" : TIPOS[borrador.tipo]}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
                {borrador.ruta}
                {borrador.original === null ? " · nuevo" : ""}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }} />
            {!SOLO_TEXTO.includes(borrador.tipo) && (
              <FormControlLabel control={<Switch checked={borrador.crudo !== null} onChange={(evento) => alternarTexto(indice, evento.target.checked)} />} label="Texto completo" />
            )}
          </Stack>
          {borrador.crudo !== null ? (
            <TextField
              fullWidth
              multiline
              minRows={16}
              value={borrador.crudo}
              onChange={(evento) => actualizar(indice, { crudo: evento.target.value })}
              InputProps={{ sx: { fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13 } }}
            />
          ) : borrador.tipo === "pruebas" ? (
            <Pruebas borrador={borrador} cambiar={(cabecera) => actualizar(indice, { cabecera })} />
          ) : (
            <Stack spacing={2}>
              <Campos borrador={borrador} catalogo={catalogo} cambiar={(cabecera) => actualizar(indice, { cabecera })} />
              <Cuerpo borrador={borrador} cambiar={(cuerpo) => actualizar(indice, { cuerpo })} />
            </Stack>
          )}
        </Paper>
      ))}

      {problemas.length > 0 && (
        <Alert severity="warning">
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Así no se podría publicar ({problemas.length}):</Typography>
          {problemas.map((problema, indice) => (
            <Typography key={indice}>
              {problema.ruta && <code>{problema.ruta}</code>} {problema.mensaje}
            </Typography>
          ))}
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction="row" spacing={1} alignItems="center">
        <Button variant="contained" size="large" disabled={cambios.length === 0 || !usuario} onClick={() => setProponiendo(true)}>
          Proponer cambio
        </Button>
        <Button onClick={() => router.back()}>Cancelar</Button>
        <Typography color="text.secondary">
          {cambios.length === 0 ? "Sin cambios todavía." : `${cambios.length} ${cambios.length === 1 ? "fichero cambiado" : "ficheros cambiados"}. ${esNuevo ? "" : "Lo publicado no cambia hasta que se apruebe."}`}
        </Typography>
      </Stack>

      <Dialog open={proponiendo} onClose={() => setProponiendo(false)} fullWidth maxWidth="sm">
        <DialogTitle>Proponer el cambio</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Qué cambia" value={tituloDePropuesta} onChange={(evento) => setTituloDePropuesta(evento.target.value)} autoFocus />
            <TextField label="Por qué (de qué ticket o situación sale)" multiline minRows={3} value={descripcion} onChange={(evento) => setDescripcion(evento.target.value)} />
            {problemas.length > 0 && <Alert severity="warning">Se puede proponer, pero no se podrá publicar hasta corregir los {problemas.length} problemas de formato.</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProponiendo(false)}>Cancelar</Button>
          <Button variant="contained" onClick={proponer} disabled={tituloDePropuesta.trim().length === 0}>
            Crear propuesta
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

function NuevaPieza({ tipo, area }: { tipo: string; area: string }) {
  const [nombre, setNombre] = useState("");
  const [grupo, setGrupo] = useState("comun");
  const [borradores, setBorradores] = useState<Borrador[] | null>(null);
  const slug = aNombre(nombre);

  if (borradores) return <Editor borradores={borradores} setBorradores={setBorradores} esNuevo titulo={`Nuevo ${TIPOS[tipo as TipoPieza]?.toLowerCase() ?? tipo}: ${nombre.trim()}`} />;
  return (
    <Paper sx={{ p: 2.5, maxWidth: 640 }}>
      <Stack spacing={2}>
        <Typography>
          {tipo === "caso" ? `Caso nuevo en el área «${area}». Va con su fichero de pruebas al lado.` : `${TIPOS[tipo as TipoPieza] ?? tipo} nuevo.`}
        </Typography>
        {tipo === "informacion" && (
          <TextField select label="Grupo" value={grupo} onChange={(evento) => setGrupo(evento.target.value)}>
            {GRUPOS_DE_INFORMACION.map((opcion) => (
              <MenuItem key={opcion} value={opcion}>
                {opcion}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField label="Nombre corto" value={nombre} onChange={(evento) => setNombre(evento.target.value)} helperText={slug ? `Será el título. La carpeta se llamará «${slug}»` : "Por ejemplo: Cambiar el titular"} autoFocus />
        <Box>
          <Button variant="contained" disabled={!slug} onClick={() => setBorradores(nuevos(tipo, area, slug, nombre.trim(), grupo))}>
            Empezar
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}

function PiezaExistente({ ruta, desdeVersion }: { ruta: string; desdeVersion: string | null }) {
  const [borradores, setBorradores] = useState<Borrador[] | null>(null);
  const [titulo, setTitulo] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const pieza = await pedir<DetallePieza>(`/pieza?ruta=${encodeURIComponent(ruta)}`);
      const nombre = pieza.tipo === "caso" ? humanizar(pieza.titulo) : pieza.titulo;
      let texto = pieza.contenido;
      if (desdeVersion) {
        const antigua = await pedir<{ contenido: string | null }>(`/en-version?ruta=${encodeURIComponent(ruta)}&version=${desdeVersion}`);
        if (antigua.contenido === null) throw new Error(`En la versión ${desdeVersion} no existía ${ruta}`);
        texto = antigua.contenido;
      }
      const lista = [desdeTexto(ruta, pieza.tipo, texto, pieza.contenido)];
      if (pieza.tipo === "caso" && pieza.rutaPruebas) {
        const pruebas = await pedir<DetallePieza>(`/pieza?ruta=${encodeURIComponent(pieza.rutaPruebas)}`).catch(() => null);
        lista.push(desdeTexto(pieza.rutaPruebas, "pruebas", pruebas?.contenido ?? null, pruebas?.contenido ?? null));
      }
      setTitulo(desdeVersion ? `Vuelve «${nombre}» a la versión ${desdeVersion}` : `Cambia «${nombre}»`);
      setBorradores(lista);
    })().catch((fallo: Error) => setError(fallo.message));
  }, [ruta, desdeVersion]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!borradores) return null;
  return (
    <Stack spacing={2}>
      {desdeVersion && <Alert severity="info">Cargado el contenido de la versión {desdeVersion}. Volver atrás también es una propuesta: se prueba y se aprueba como cualquier otra.</Alert>}
      <Editor borradores={borradores} setBorradores={setBorradores} esNuevo={false} titulo={titulo} />
    </Stack>
  );
}

function Contenido() {
  const parametros = useSearchParams();
  const ruta = parametros.get("ruta");
  const nuevo = parametros.get("nuevo");
  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {ruta ? "Editar" : "Crear"}
      </Typography>
      {ruta ? <PiezaExistente ruta={ruta} desdeVersion={parametros.get("desdeVersion")} /> : nuevo ? <NuevaPieza tipo={nuevo} area={parametros.get("area") ?? ""} /> : <Alert severity="info">Elige una pieza para editar.</Alert>}
    </Stack>
  );
}

export default function PaginaDeEdicion() {
  return (
    <Suspense>
      <Contenido />
    </Suspense>
  );
}
