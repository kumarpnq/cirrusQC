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
            transform: "scale(0.75)", // Adjust the scale to make the checkbox smaller
          },
        },
      },
    },
  },
});

export default theme;
