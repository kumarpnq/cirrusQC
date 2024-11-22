import {
  Button,
  Divider,
  Tabs,
  Tab,
  Typography,
  Box,
  Modal,
  IconButton,
  Paper,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import QueryBox from "./QueryBox";
import { useState } from "react";
import { EditModalActions } from "./EditModalActions";

const AddEditDialog = ({ open, handleClose, fromWhere }) => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
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
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="language tabs"
          >
            <Tab label="English" />
            <Tab label="Other" />
          </Tabs>
          <Divider />
          <EditModalActions tabValue={tabValue} />
          <QueryBox type={"Include Query"} />
          {/* exclude query */}
          <QueryBox type={"Exclude Query"} />
        </Box>
        <Divider />
        <Box
          component={Paper}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            py: 1,
            gap: 1,
          }}
        >
          <Button
            onClick={handleClose}
            color="primary"
            size="small"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClose}
            color="primary"
            size="small"
            variant="outlined"
          >
            Save
          </Button>
        </Box>
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
