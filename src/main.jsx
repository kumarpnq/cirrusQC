import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ContextProvider from "./context/ContextProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./muiTheme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ContextProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ContextProvider>
  </BrowserRouter>
);
