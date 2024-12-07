import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CustomTextField from "../../../@core/CutsomTextField";
import CustomSingleSelect from "../../../@core/CustomSingleSelect2";
import useFetchData from "../../../hooks/useFetchData";
import { url } from "../../../constants/baseUrl";
import CustomMultiSelect from "../../../@core/CustomMultiSelect";
import YesOrNo from "../../../@core/YesOrNo";

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

const StyledWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "3px",
  padding: theme.spacing(1),
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    boxShadow: `0px 4px 8px ${theme.palette.grey[300]}`,
  },
}));

const StyledText = styled(Typography)({
  color: "GrayText",
  fontSize: "1em",
  width: 100,
  textWrap: "nowrap",
});

const AddEditModal = ({ open, handleClose, row, fromWhere }) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [activeUser, setActiveUser] = useState("");
  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState("");

  // * get user ids
  const userIds = row?.whatsappConfig?.map((item) => item.userId) || [];
  //  * get companies
  const { data: companiesData } = useFetchData(`${url}companylist/`);

  useEffect(() => {
    if (fromWhere === "Edit") {
      let rowForStates = row?.whatsappConfig?.find(
        (i) => i.userId === selectedUser
      );
      setActiveUser(rowForStates?.isActive === "Y" ? "Yes" : "No");
      setSelectedCompanies(rowForStates?.companyIds || []);
      setSelectedSlots(
        rowForStates?.slots
          ?.filter((i) => i.isActive === "Y")
          .map((i) => i.time) || []
      );
      setSelectedContacts(
        rowForStates?.contacts
          ?.filter((i) => i.isActive === "Y")
          .map((i) => i.contactNumber)
          .join(",") || ""
      );
    }
  }, [selectedUser, fromWhere]);
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
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          fontSize={"1em"}
        >
          {fromWhere} Modal
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box>
            <StyledWrapper>
              <StyledText>Client : </StyledText>
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
                  keyId="clientid"
                  keyName="clientname"
                  options={[]}
                  selectedItem={selectedClient}
                  setSelectedItem={setSelectedClient}
                  title="Client"
                />
              )}
            </StyledWrapper>

            <StyledWrapper>
              <StyledText>Active : </StyledText>
              <FormControlLabel control={<Checkbox size="small" />} />
            </StyledWrapper>
            <StyledWrapper>
              <StyledText>User : </StyledText>
              <YesOrNo
                mapValue={userIds}
                placeholder="User"
                value={selectedUser}
                setValue={setSelectedUser}
                // width={"100%"}
              />
            </StyledWrapper>
            <Box sx={{ border: "1px solid #ccc", p: 0.5, my: 0.2 }}>
              <StyledWrapper>
                <StyledText>Active : </StyledText>
                <YesOrNo
                  mapValue={["Yes", "No"]}
                  placeholder="Active"
                  value={activeUser}
                  setValue={setActiveUser}
                  // width={"100%"}
                />
              </StyledWrapper>
              <StyledWrapper>
                <StyledText>Company : </StyledText>
                <CustomMultiSelect
                  dropdownToggleWidth={280}
                  dropdownWidth={280}
                  keyId="companyid"
                  keyName="companyname"
                  options={[{ companyid: 1, companyname: "dabur" }]}
                  selectedItems={selectedCompanies}
                  setSelectedItems={setSelectedCompanies}
                  title="Companies"
                />
              </StyledWrapper>
              <StyledWrapper>
                <StyledText>Screen : </StyledText>
                <CustomMultiSelect
                  dropdownToggleWidth={280}
                  dropdownWidth={280}
                  keyId="screenId"
                  keyName="screenName"
                  options={[
                    { screenId: "online", screenName: "Online" },
                    { screenId: "print", screenName: "Print" },
                    { screenId: "both", screenName: "Combined" },
                  ]}
                  selectedItems={selectedSlots}
                  setSelectedItems={setSelectedSlots}
                  title="Screens"
                />
              </StyledWrapper>
              <StyledWrapper>
                <StyledText>Zone : </StyledText>
                <YesOrNo
                  mapValue={userIds}
                  placeholder="Zone"
                  value={selectedTimeZone}
                  setValue={setSelectedTimeZone}
                  // width={"100%"}
                />
              </StyledWrapper>
              <StyledWrapper>
                <StyledText>Slots : </StyledText>
                <CustomMultiSelect
                  dropdownToggleWidth={280}
                  dropdownWidth={280}
                  keyId="slotId"
                  keyName="slotName"
                  options={[{ slotId: 1, slotName: "00:00-00:30" }]}
                  selectedItems={selectedSlots}
                  setSelectedItems={setSelectedSlots}
                  title="Slots"
                />
              </StyledWrapper>
              <StyledWrapper>
                <StyledText>Contacts : </StyledText>
                <TextField
                  multiline
                  fullWidth
                  value={selectedContacts}
                  onChange={(e) => setSelectedContacts(e.target.value)}
                />
              </StyledWrapper>
            </Box>
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
