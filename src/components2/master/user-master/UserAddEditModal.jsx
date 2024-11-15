import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { style, StyledText, StyledWrapper } from "../common";
import CustomTextField from "../../../@core/CutsomTextField";
import { useState } from "react";

const UserAddEditModal = ({ open, handleClose }) => {
  const [userType, setUserType] = useState("");
  const [userName, setUserName] = useState("");
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          fontSize={"1em"}
        >
          Add / Edit User
        </Typography>

        <Box sx={{ border: "1px solid #DDD", borderRadius: "3px", padding: 1 }}>
          <StyledWrapper>
            <StyledText>User Type : </StyledText>
            <CustomTextField
              width={"100%"}
              type={"text"}
              value={userType}
              setValue={setUserType}
              placeholder={"User Type"}
            />
          </StyledWrapper>
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
      </Box>
    </Modal>
  );
};

UserAddEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
export default UserAddEditModal;
