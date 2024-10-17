import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Nunito, sans-serif",
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        checkboxInput: {
          "& .MuiCheckbox-root": {
            transform: "scale(0.75)",
          },
        },
      },
    },
  },
});

export default theme;
