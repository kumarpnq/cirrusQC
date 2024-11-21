import { useContext, useState } from "react";
import CryptoJS from "crypto-js";
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
import { CircularProgress } from "@mui/material";

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
    minHeight: "80vh",
    flexDirection: "column",
  },
  form: {
    width: "300px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow
    border: "1px solid #ccc", // Border
  },
  button: {
    // backgroundColor: "#0a4f7d",
    // color: "white",
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
  //  key
  const keyHex = import.meta.env.VITE_PASS_ENCRYPT_KEY;

  // Function to encrypt password using CryptoJS
  const encryptPassword = (password, key) => {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(
      password,
      CryptoJS.enc.Hex.parse(key),
      { iv }
    );
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const encryptedBase64 = encrypted.toString();
    return ivBase64 + ":" + encryptedBase64;
  };

  const [loading, setLoading] = useState(false);
  //encryptPassword(password, keyHex)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setPermissionLoading(true);
    try {
      setLoading(true);
      const res = await axios.post(`${url}authenticate/`, {
        loginname: name,
        password: encryptPassword(password, keyHex),
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
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.container}>
        <Box>
          <img src="./Research.png" alt="logo" height={100} width={100} />
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
              variant={loading ? "outlined" : "contained"}
              color="primary"
              fullWidth
              className={classes.button}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                color: loading ? "#0a4f7d" : "white",
              }}
            >
              {loading && <CircularProgress size={"1em"} />}
              Login
            </Button>
          </form>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
