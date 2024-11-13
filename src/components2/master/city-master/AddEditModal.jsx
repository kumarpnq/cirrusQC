import PropTypes from "prop-types";
import { Box, Modal, Typography, Button, Divider } from "@mui/material";
import { styled } from "@mui/system";
import CustomTextField from "../../../@core/CutsomTextField";
import { useState } from "react";

const StyledWrapper = styled(Box)({
  display: "flex",
  alignItems: "Center",
  padding: 2,
});

const StyledText = styled(Typography)({
  color: "GrayText",
  fontSize: "1em",
  textWrap: "nowrap",
  width: 157,
});

const AddEditModal = ({ open, handleClose }) => {
  const [city, setCity] = useState("");
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #ddd",
    boxShadow: 24,
    p: 1,
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
          Add / Edit City
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Add or edit the city details here.
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
