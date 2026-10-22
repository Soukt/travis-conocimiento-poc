import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const CABECERAS = /^(diff --git|index |--- |\+\+\+ |new file mode|deleted file mode|\\ No newline)/;

export function Diferencias({ texto }: { texto: string }) {
  const lineas = texto.split("\n").filter((linea, indice, todas) => !CABECERAS.test(linea) && !(indice === todas.length - 1 && linea === ""));
  if (lineas.length === 0) return <Typography color="text.secondary">Sin diferencias.</Typography>;
  return (
    <Box component="pre" sx={{ m: 0, fontSize: 12.5, fontFamily: "ui-monospace, Menlo, monospace", overflow: "auto", border: 1, borderColor: "divider", borderRadius: 1 }}>
      {lineas.map((linea, indice) => {
        const estilo = linea.startsWith("@@")
          ? { bgcolor: "#eef2ff", color: "#5b6b9a" }
          : linea.startsWith("+")
            ? { bgcolor: "#e6f6e6" }
            : linea.startsWith("-")
              ? { bgcolor: "#fdecec" }
              : {};
        return (
          <Box key={indice} sx={{ px: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word", ...estilo }}>
            {linea.startsWith("@@") ? "···" : linea || " "}
          </Box>
        );
      })}
    </Box>
  );
}
