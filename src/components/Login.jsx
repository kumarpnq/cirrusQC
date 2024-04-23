import { useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { ResearchContext } from "../context/ContextProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { url } from "../constants/baseUrl";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0a4f7d",
    },
  },
});

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  form: {
    width: "300px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow
    border: "1px solid #ccc", // Border
  },
  button: {
    backgroundColor: "#0a4f7d",
    color: "white",
    marginTop: "1rem",
  },
}));

const Login = () => {
  const classes = useStyles();
  const { name, setName, password, setPassword, setUserToken, setDumpAccess } =
    useContext(ResearchContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(`${url}authenticate/`, {
        loginname: name,
        password: password,
      });

      const data = JSON.parse(res.config.data);
      const isAccess = res.data.dump_access;
      const loginname = data.loginname;
      if (res.status === 200) {
        setDumpAccess(isAccess);
        localStorage.setItem("user", res.data.access_token);
        sessionStorage.setItem("user", true);
        setUserToken(localStorage.getItem("user"));
        navigate("/");
        toast.success(`Welcome ${loginname}`, {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(error.message, {
        autoClose: 3000,
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.container}>
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={classes.button}
          >
            Login
          </Button>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
