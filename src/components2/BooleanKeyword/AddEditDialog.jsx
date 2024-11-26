import { Divider, Typography, Box, Modal, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import QueryBox from "./QueryBox";

import { EditModalActions } from "./EditModalActions";
import { useState } from "react";

const AddEditDialog = ({ open, handleClose, fromWhere, row }) => {
  const [language, setLanguage] = useState("en");

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "99vw",
          bgcolor: "background.paper",
          border: "1px solid #000",
          boxShadow: 24,
          height: "99vh",
          overflow: "scroll",
          p: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontSize={"1em"}>{fromWhere} Item</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>
          <Divider />
          <EditModalActions
            language={language}
            setLanguage={setLanguage}
            row={row}
          />
          <QueryBox type={"Include Query"} row={row} language={language} />
          {/* exclude query */}
          <QueryBox type={"Exclude Query"} row={row} language={language} />
        </Box>
        <Divider />
      </Box>
    </Modal>
  );
};

AddEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  fromWhere: PropTypes.string.isRequired,
};
export default AddEditDialog;
