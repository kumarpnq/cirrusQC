import PropTypes from "prop-types";
import { Box, Modal, Typography, Button, Divider } from "@mui/material";
import CustomTextField from "../../../@core/CutsomTextField";
import { useState } from "react";
import { style, StyledText, StyledWrapper } from "../common";

const AddEditModal = ({ open, handleClose }) => {
  const [city, setCity] = useState("");

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
          Add / Edit City
        </Typography>

        <Box sx={{ border: "1px solid #DDD", borderRadius: "3px", padding: 1 }}>
          <StyledWrapper>
            <StyledText>City Name : </StyledText>
            <CustomTextField
              width={"100%"}
              type={"text"}
              value={city}
              setValue={setCity}
              placeholder={"City"}
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>State Name : </StyledText>
            <CustomTextField
              width={"100%"}
              type={"text"}
              value={city}
              setValue={setCity}
              placeholder={"State"}
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>Country Name : </StyledText>
            <CustomTextField
              width={"100%"}
              type={"text"}
              value={city}
              setValue={setCity}
              placeholder={"Country"}
            />
          </StyledWrapper>
          <StyledWrapper>
            <StyledText>Active : </StyledText>
            <CustomTextField
              width={"100%"}
              type={"text"}
              value={city}
              setValue={setCity}
              placeholder={"Active"}
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

// PropTypes validation
AddEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddEditModal;
