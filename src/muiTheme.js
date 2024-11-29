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
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#0a4f7d", // Primary background color when selected
            color: "#ffffff", // Text color when selected
            "&:hover": {
              backgroundColor: "#1a689a", // Slightly lighter color on hover
            },
          },
        },
      },
    },
  },
});

export default theme;
