import PropTypes from "prop-types";
import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import { StyledText, StyledWrapper } from "../common";
import CustomTextField from "../../../@core/CutsomTextField";
import { useState } from "react";

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

const IndustryMasterAddEdit = ({ open, handleClose, openFromWHere }) => {
  const [industryName, setIndustryName] = useState("");
  const [active, setActive] = useState("Yes");
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          fontSize={"1em"}
        >
          Industry Master {openFromWHere}
        </Typography>
        <Box id="modal-description" mt={2}>
          <StyledWrapper>
            <StyledText>Industry Name : </StyledText>
            <CustomTextField width={"100%"} />
          </StyledWrapper>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box display="flex" justifyContent="flex-end">
          <Button onClick={handleClose} variant="outlined" size="small">
            Cancel
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

IndustryMasterAddEdit.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  openFromWHere: PropTypes.string.isRequired,
};

export default IndustryMasterAddEdit;
