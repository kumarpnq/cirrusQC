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
  const {
    name,
    setName,
    password,
    setPassword,
    setUserToken,
    setScreenPermissions,
    setPermissionLoading,
  } = useContext(ResearchContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPermissionLoading(true);
    try {
      const res = await axios.post(`${url}authenticate/`, {
        loginname: name,
        password: password,
      });
      const data = JSON.parse(res.config.data);
      const loginname = data.loginname;
      if (res.status === 200) {
        localStorage.setItem("user", res.data.access_token);
        const screen_access = res.data.screen_access;

        sessionStorage.setItem("prmsn", JSON.stringify(screen_access));
        sessionStorage.setItem("user", true);
        setUserToken(localStorage.getItem("user"));
        const permissionData = sessionStorage.getItem("prmsn");

        const parsedPermissions = JSON.parse(permissionData);
        // Map permission values to boolean
        const mappedPermissions = Object.fromEntries(
          Object.entries(parsedPermissions).map(([key, value]) => [
            key,
            value === "Yes",
          ])
        );
        const greenFlag = Object.values(mappedPermissions).some(
          (permission) => permission
        );
        setScreenPermissions(mappedPermissions);

        if (greenFlag) {
          sessionStorage.setItem("userName", loginname);
          navigate("/");
          toast.success(`Welcome ${loginname}`, {
            autoClose: 3000,
          });
        } else {
          localStorage.removeItem("user");
          throw new Error();
        }
      }
    } catch (error) {
      toast.error("Name or Password Not match with our Records.", {
        autoClose: 3000,
      });
    } finally {
      setPermissionLoading(false);
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
