import PropTypes from "prop-types";
import { Modal, Box, Typography, Button, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { StyledText, StyledWrapper } from "./common";
import CustomTextField from "../../@core/CutsomTextField";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
import { DataGrid } from "@mui/x-data-grid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 1,
};

const UserDetailsAddEdit = ({
  open,
  handleClose,
  openedFromWhere,
  selectedRow,
}) => {
  const [username, setUsername] = useState("");
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState("");
  const [links, setLinks] = useState([
    {
      id: 1,
      title: "Introduction to Programming",
    },
    {
      id: 2,
      title: "Advanced Database Systems",
    },
    {
      id: 3,
      title: "Machine Learning Basics",
    },
    {
      id: 4,
      title: "Artificial Intelligence Fundamentals",
    },
    {
      id: 5,
      title: "Web Development with JavaScript",
    },
  ]);

  const [selectedLinks, setSelectedLinks] = useState([1, 2]);

  const columns = [
    {
      field: "title",
      headerName: "Link",
      width: 300,
    },
  ];

  useEffect(() => {
    if ((open, openedFromWhere === "edit")) {
      setUsername(selectedRow?.userName);
      setLoginName(selectedRow?.loginName);
      setPassword(selectedRow?.password);
      setActive(selectedRow?.active ? "Yes" : "No");
    }
  }, [open, openedFromWhere, selectedRow]);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="user-modal-title"
      aria-describedby="user-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="user-modal-title"
          variant="h6"
          component="h2"
          fontSize={"1em"}
        >
          {openedFromWhere === "edit" ? "Edit User" : "Add User"}
        </Typography>

        <Box sx={{ border: "1px solid #DDD", borderRadius: "3px", padding: 1 }}>
          <StyledWrapper>
            <StyledText>User Name : </StyledText>
            <CustomTextField
              width={"100%"}
              type={"text"}
              value={username}
              setValue={setUsername}
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>Login Name : </StyledText>
            <CustomTextField
              width={"100%"}
              type={"text"}
              value={loginName}
              setValue={setLoginName}
              autoComplete={"off"}
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>Password : </StyledText>
            <CustomTextField
              width={"100%"}
              type={"password"}
              value={password}
              setValue={setPassword}
              placeholder={"Password"}
              autoComplete="new-password"
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>Active : </StyledText>
            <CustomTextField
              width={"100%"}
              type={"text"}
              value={active}
              setValue={setActive}
              placeholder={"Active"}
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>Links : </StyledText>
            <CustomMultiSelect
              dropdownWidth={"100%"}
              dropdownToggleWidth={253}
              keyId="id"
              keyName="title"
              options={links}
              title="Links"
              selectedItems={selectedLinks}
              setSelectedItems={setSelectedLinks}
            />
          </StyledWrapper>
          <Box sx={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={[
                {
                  id: 1,
                  title: "Introduction to Programming",
                },
                {
                  id: 2,
                  title: "Advanced Database Systems",
                },
              ]}
              columns={columns}
              checkboxSelection
              density="compact"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />
        <Box
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
            variant="outlined"
            color="primary"
            size="small"
          >
            {openedFromWhere === "edit" ? "Save Changes" : "Add User"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

UserDetailsAddEdit.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  openedFromWhere: PropTypes.string.isRequired,
  selectedRow: PropTypes.object,
};

export default UserDetailsAddEdit;
