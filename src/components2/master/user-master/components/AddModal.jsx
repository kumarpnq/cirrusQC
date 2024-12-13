import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { StyledWrapper } from "../../common";
import YesOrNo from "../../../../@core/YesOrNo";
import { useEffect, useState } from "react";
import CustomTextField from "../../../../@core/CutsomTextField";
import axiosInstance from "../../../../../axiosConfig";
import { styled } from "@mui/system";
import toast from "react-hot-toast";

const StyledText = styled(Typography)({
  color: "GrayText",
  width: 150,
  fontSize: "1em",
});

const AddModal = ({ open, handleClose }) => {
  const [userType, setUserType] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");

  // * add states
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generatePassword = () => {
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      let password = "";
      for (let i = 0; i < 8; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return password;
    };

    if (loginName && email) {
      const generatedPassword = generatePassword();
      setPassword(generatedPassword);
    }
  }, [loginName, email]);

  const handleSave = async () => {
    let userTypeInShort = userType === "Admin" ? "US" : "CL";
    const newUser = {
      userType: userTypeInShort,
      userName,
      email,
      fullName,
      loginName,
      password,
    };

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `http://127.0.0.1:8000/addUser/`,
        newUser
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setUserType("");
        setUserName("");
        setEmail("");
        setFullName("");
        setLoginName("");
        setPassword("");
        handleClose();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-modal-title"
      aria-describedby="add-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          border: "1px solid #000",
          boxShadow: 24,
          p: 2,
        }}
      >
        <Typography id="add-modal-title" variant="h6" component="h2">
          Add Item
        </Typography>
        <Box>
          <StyledWrapper>
            <StyledText sx={{ width: 150 }}>User Type:</StyledText>
            <YesOrNo
              mapValue={["Admin", "Client"]}
              placeholder="UserType"
              value={userType}
              setValue={setUserType}
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>User Name:</StyledText>
            <CustomTextField
              placeholder="User Name"
              value={userName}
              setValue={setUserName}
              type="text"
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>Email:</StyledText>
            <CustomTextField
              placeholder="Email"
              value={email}
              setValue={setEmail}
              type="email"
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>Full Name:</StyledText>
            <CustomTextField
              placeholder="Full Name"
              value={fullName}
              setValue={setFullName}
              type="text"
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>Login Name:</StyledText>
            <CustomTextField
              placeholder="Login Name"
              value={loginName}
              setValue={setLoginName}
              type="text"
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>Password:</StyledText>
            <CustomTextField
              placeholder="Password"
              value={password}
              setValue={setPassword}
              type="password"
              autoComplete="new-password"
            />
          </StyledWrapper>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography
          id="add-modal-description"
          sx={{ mt: 1, display: "flex", justifyContent: "end" }}
        >
          <Button
            onClick={handleClose}
            sx={{ mt: 0 }}
            size="small"
            variant="outlined"
          >
            Close
          </Button>
          <Button
            onClick={handleSave}
            sx={{ mt: 0, ml: 1, display: "flex", alignItems: "center", gap: 1 }}
            size="small"
            variant="outlined"
          >
            {loading && <CircularProgress size={"1em"} />}
            Save
          </Button>
        </Typography>
      </Box>
    </Modal>
  );
};

AddModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddModal;
