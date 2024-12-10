import { Box, Button, Divider } from "@mui/material";
import CustomTextField from "../../../@core/CutsomTextField";
import { useState } from "react";
import { StyledText, StyledWrapper } from "../common";

const AddEditClient = ({ handleClose }) => {
  const [userName, setUserName] = useState("");
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      <Box>
        <StyledWrapper>
          <StyledText>User Name : </StyledText>
          <CustomTextField
            width={"100%"}
            type={"text"}
            value={userName}
            setValue={setUserName}
            placeholder={"User Name"}
          />
        </StyledWrapper>

        <StyledWrapper>
          <StyledText>Login Name : </StyledText>
          <CustomTextField
            width={"100%"}
            type={"text"}
            value={loginName}
            setValue={setLoginName}
            placeholder={"Login Name"}
          />
        </StyledWrapper>
        <StyledWrapper>
          <StyledText>Password : </StyledText>
          <CustomTextField
            width={"100%"}
            type={"text"}
            value={password}
            setValue={setPassword}
            placeholder={"Password"}
          />
        </StyledWrapper>
      </Box>
      <Divider />
      <Box
        mt={2}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ ml: 2 }}
          size="small"
        >
          Cancel
        </Button>
        <Button
          onClick={handleClose}
          variant="contained"
          color="primary"
          size="small"
        >
          Save
        </Button>
      </Box>
    </div>
  );
};

export default AddEditClient;
