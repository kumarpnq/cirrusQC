import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { useEffect, useLayoutEffect, useState } from "react";
import CustomSingleSelect from "../../../@core/CustomSingleSelect2";
import useFetchData from "../../../hooks/useFetchData";
import { url } from "../../../constants/baseUrl";
import CustomMultiSelect from "../../../@core/CustomMultiSelect";
import YesOrNo from "../../../@core/YesOrNo";
import toast from "react-hot-toast";
import axiosInstance from "../../../../axiosConfig";
import { timeSlots } from "../../../constants/dataArray";
import { getCompanies, getContacts, getSlots } from "./utils";

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

const AddEditModal = ({ open, handleClose, row, fromWhere, fetchMainData }) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [activeUser, setActiveUser] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState("");
  const [selectedPrint, setSelectedPrint] = useState("");
  const [selectedOnline, setSelectedOnline] = useState("");
  const [loginNames, setLoginNames] = useState([]);

  // * update states
  const [uploadLoading, setUploadLoading] = useState(false);

  // * get user ids
  const userIds = row?.whatsappConfig?.map((item) => item.userId) || [];
  //  * get companies and client
  const { data: clientData } = useFetchData(`${url}clientlist/`);
  const { data: companiesData } = useFetchData(
    `${url}companylist/${fromWhere === "Edit" ? row?.clientId : selectedClient}`
  );
  const companyArrayToMap = companiesData?.data?.companies || [];

  useLayoutEffect(() => {
    const fetchLoginDetail = async () => {
      try {
        const response = await axiosInstance.get(
          `getusersforclient/?clientId=${selectedClient}`
        );

        setLoginNames(response.data.loginNames || []);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (open && fromWhere === "Add") {
      fetchLoginDetail();
    }
  }, [open, selectedClient, fromWhere]);

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
      setSelectedPrint(rowForStates?.isPrint || "");
      setSelectedOnline(rowForStates?.isOnline || "");
    }
  }, [selectedUser, fromWhere]);

  const handleCheckboxChange = (e, which) => {
    if (which === "print") {
      setSelectedPrint(e.target.checked ? "Y" : "N");
    } else {
      setSelectedOnline(e.target.checked ? "Y" : "N");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setUploadLoading(true);
      const slotChanges = await getSlots(row, selectedUser, selectedSlots);

      let rowForStates = row?.whatsappConfig?.find(
        (i) => i.userId === selectedUser
      );
      let activeUserLocal = rowForStates?.isActive === "Y" ? "Yes" : "No";
      let companyChanges = await getCompanies(
        row,
        selectedUser,
        selectedCompanies
      );
      let contactChanges = await getContacts(
        row,
        selectedUser,
        selectedContacts.split(",")
      );

      const requestData = {
        clientId: row.clientId,
        userId: selectedUser,
      };

      if (activeUser !== activeUserLocal)
        requestData.isActive = activeUser === "Yes" ? "Y" : "N";
      if (companyChanges.length) requestData.companyIds = selectedCompanies;
      if (slotChanges.length) requestData.slots = slotChanges;
      if (contactChanges.length) requestData.contacts = contactChanges;
      if (rowForStates.isPrint !== selectedPrint)
        requestData.isPrint = selectedPrint;
      if (rowForStates.isOnline !== selectedOnline)
        requestData.isOnline = selectedOnline;

      const response = await axiosInstance.post(
        `updateWhatsappSchedule/`,
        requestData
      );
      if (response.status === 200) {
        toast.success(response.data.data.message);
        handleClose();
        fetchMainData();
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleInsert = async (event) => {
    event.preventDefault();
    try {
      const preparedSlots = selectedSlots.map((i) => ({
        time: i,
        isActive: "Y",
      }));
      const preparedContacts = selectedContacts.split(",").map((i) => ({
        contactNumber: i,
        isActive: "Y",
      }));
      const preparedCompanies = selectedCompanies.map((i) => ({
        contactId: i,
        isActive: "Y",
      }));
      setUploadLoading(true);
      const requestData = {
        clientId: selectedClient,
        userId: selectedUser,
        companyIds: preparedCompanies,
        slots: preparedSlots,
        contacts: preparedContacts,
        isPrint: selectedPrint,
        isOnline: selectedOnline,
      };
      const response = await axiosInstance.post(
        `addWhatsappSchedule`,
        requestData
      );
      if (response.status === 200) {
        toast.success(response.data.data.message);
        handleClose();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUploadLoading(false);
    }
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
        <form onSubmit={fromWhere === "Edit" ? handleSubmit : handleInsert}>
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
                  options={clientData?.data?.clients || []}
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
                mapValue={
                  fromWhere === "Edit"
                    ? userIds
                    : loginNames.map((i) => i.loginName)
                }
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
                  dropdownToggleWidth={270}
                  dropdownWidth={270}
                  keyId="companyid"
                  keyName="companyname"
                  options={companyArrayToMap || []}
                  selectedItems={selectedCompanies}
                  setSelectedItems={setSelectedCompanies}
                  title="Companies"
                />
              </StyledWrapper>
              <StyledWrapper>
                <StyledText>Print : </StyledText>
                <Checkbox
                  checked={selectedPrint === "Y"}
                  onChange={(e) => handleCheckboxChange(e, "print")}
                />
              </StyledWrapper>
              <StyledWrapper>
                <StyledText>Online : </StyledText>
                <Checkbox
                  checked={selectedOnline === "Y"}
                  onChange={(e) => handleCheckboxChange(e, "online")}
                />
              </StyledWrapper>

              <StyledWrapper>
                <StyledText>Slots : </StyledText>
                <Select
                  multiple
                  value={selectedSlots}
                  onChange={(e) => setSelectedSlots(e.target.value)}
                  placeholder="Slots"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                        fontSize: "0.9em",
                      },
                    },
                  }}
                  style={{ height: 25, minWidth: 270, fontSize: "0.9em" }}
                >
                  {timeSlots.map((slot) => (
                    <MenuItem key={slot} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
                </Select>
              </StyledWrapper>
              <StyledWrapper>
                <StyledText>Contacts : </StyledText>
                <TextField
                  multiline
                  fullWidth
                  InputProps={{ style: { fontSize: "0.9em" } }}
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
            <Button
              variant="outlined"
              size="small"
              type="submit"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {uploadLoading && <CircularProgress size={"1em"} />}
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
