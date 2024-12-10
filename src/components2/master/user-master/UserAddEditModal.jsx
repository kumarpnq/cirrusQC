import { Box, Modal, Typography, Tabs, Tab } from "@mui/material";
import PropTypes from "prop-types";
import { style } from "../common";
import { useState } from "react";
import AddEditClient from "./AddEditClient";
import AddEditAdmin from "./AddEditAdmin";

const UserAddEditModal = ({ open, handleClose }) => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Client" />
            <Tab label="Admin" />
          </Tabs>
          {value === 0 ? (
            <AddEditClient handleClose={handleClose} />
          ) : (
            <AddEditAdmin />
          )}
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
