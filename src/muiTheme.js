import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Nunito, sans-serif",
  },
  palette: {
    primary: {
      main: "#0a4f7d",
      light: "#1a689a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f1f1f1",
      dark: "#e0e0e0",
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#0a4f7d",
          color: "#ffffff",
          fontWeight: "bold",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          // transform: "scale(0.50)",
        },
      },
    },
  },
});

export default theme;
