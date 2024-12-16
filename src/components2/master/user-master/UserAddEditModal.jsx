import { Box, Modal, Typography, Tabs, Tab } from "@mui/material";
import PropTypes from "prop-types";
import { style } from "../common";
import { useEffect, useState } from "react";
import AddEditClient from "./AddEditClient";
import AddEditAdmin from "./AddEditAdmin";

const UserAddEditModal = ({ open, handleClose, row, fromWhere }) => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // * set value according to the user
  useEffect(() => {
    if (row && fromWhere === "Edit") {
      let localValue = row?.userType === "US" ? 1 : 0;
      setValue(localValue);
    }
  }, [fromWhere, row]);
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
          Edit User
        </Typography>

        <Box sx={{ border: "1px solid #DDD", borderRadius: "3px", padding: 1 }}>
          {fromWhere === "Add" && (
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Client" />
              <Tab label="Admin" />
            </Tabs>
          )}

          {value === 0 ? (
            <AddEditClient
              handleClose={handleClose}
              fromWhere={fromWhere}
              row={row}
            />
          ) : (
            <AddEditAdmin
              handleClose={handleClose}
              activeTab={value}
              fromWhere={fromWhere}
              row={row}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

UserAddEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  row: PropTypes.object,
  fromWhere: PropTypes.string,
};
export default UserAddEditModal;
