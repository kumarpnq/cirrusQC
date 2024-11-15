import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { style, StyledText, StyledWrapper } from "../common";
import CustomTextField from "../../../@core/CutsomTextField";

const CountryAddEdit = ({ open, handleClose }) => {
  const [country, setCountry] = useState("");
  const [active, setActive] = useState("");
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
          Add / Edit Country
        </Typography>

        <Box sx={{ border: "1px solid #DDD", borderRadius: "3px", padding: 1 }}>
          <StyledWrapper>
            <StyledText>Country : </StyledText>
            <CustomTextField
              width={"100%"}
              type={"text"}
              value={country}
              setValue={setCountry}
              placeholder={"Country"}
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

CountryAddEdit.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CountryAddEdit;
