import { createTheme } from "@mui/material/styles";

// Mismos colores y tipografía que fenix-next (src/0-shared/components/0-theme), para ver cómo quedaría allí.
const fuente = ["Montserrat", "system-ui", "sans-serif"].join(",");

export const tema = createTheme({
  typography: {
    fontFamily: fuente,
    body1: { fontSize: 13 },
    body2: { fontSize: 13 },
    button: { textTransform: "none" },
  },
  palette: {
    primary: { light: "#ffe7b8", main: "#ffae17", dark: "#ff8f18", contrastText: "#fff" },
    secondary: { light: "#c9f7f5", main: "#1bc5bd", dark: "#06a29b", contrastText: "#fff" },
    background: { default: "#f5f6fa" },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: { defaultProps: { variant: "outlined" } },
    MuiChip: { defaultProps: { size: "small" } },
  },
});
