import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CustomTextField from "../../../@core/CutsomTextField";
import CustomSingleSelect from "../../../@core/CustomSingleSelect2";
import useFetchData from "../../../hooks/useFetchData";
import { url } from "../../../constants/baseUrl";

// Styles for modal content
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 1,
};

const StyledWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 1,
});

const StyledText = styled(Typography)({
  color: "GrayText",
  fontSize: "1em",
  width: 100,
});

const AddEditModal = ({ open, handleClose, row, fromWhere }) => {
  const [selectedClient, setSelectedClient] = useState("");
  console.log(row);
  // * get user ids
  const userIds = row?.whatsappConfig?.map((item) => item.userId) || [];
  //  * get companies
  const { data: companiesData } = useFetchData(`${url}companylist/`);

  useEffect(() => {}, []);
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          {fromWhere} Modal
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box>
            <StyledWrapper>
              <StyledText>Client</StyledText>
              {fromWhere === "Edit" ? (
                <TextField
                  fullWidth
                  value={row?.clientName}
                  InputProps={{
                    readOnly: true,
                    style: { height: 25, fontSize: "0.9em" },
                  }}
                />
              ) : (
                <CustomSingleSelect
                  dropdownToggleWidth={"100%"}
                  dropdownWidth={"100%"}
                  keyId="companyid"
                  keyName="companyname"
                  options={[]}
                  selectedItem={selectedClient}
                  setSelectedItem={setSelectedClient}
                  title="Client"
                />
              )}
            </StyledWrapper>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ mt: 0, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClose}
              sx={{ mr: 0.5 }}
            >
              Close
            </Button>
            <Button variant="outlined" size="small" type="submit">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

AddEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  row: PropTypes.object,
  fromWhere: PropTypes.string,
};

export default AddEditModal;
