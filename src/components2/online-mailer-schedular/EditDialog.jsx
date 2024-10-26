import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  Switch,
  FormControl,
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import useFetchData from "../../hooks/useFetchData";
import { url, url_mongo } from "../../constants/baseUrl";
import { useEffect, useState } from "react";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { toast } from "react-toastify";

const StyledItemWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 1,
  marginTop: 4,
});
const StyledText = styled(Typography)({
  color: "GrayText",
  textWrap: "nowrap",
  width: 150,
  fontSize: "1em",
});

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));

const YesNoSwitchWrapper = styled(Box)(({ _ }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: 120,
  padding: "10px 20px",
  borderRadius: 20,
}));

const CustomSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    "&.Mui-checked": {
      color: theme.palette.success.main,
    },
    "& + .MuiSwitch-track": {
      backgroundColor: theme.palette.error.light,
    },
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: theme.palette.success.light,
    },
  },
  "& .MuiSwitch-thumb": {
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 20,
  },
}));

const timeStampData = [
  { id: "00:00", timestamp: "00:00" },
  { id: "00:30", timestamp: "00:30" },
  { id: "01:00", timestamp: "01:00" },
  { id: "01:30", timestamp: "01:30" },
  { id: "02:00", timestamp: "02:00" },
  { id: "02:30", timestamp: "02:30" },
  { id: "03:00", timestamp: "03:00" },
  { id: "03:30", timestamp: "03:30" },
  { id: "04:00", timestamp: "04:00" },
  { id: "04:30", timestamp: "04:30" },
  { id: "05:00", timestamp: "05:00" },
  { id: "05:30", timestamp: "05:30" },
  { id: "06:00", timestamp: "06:00" },
  { id: "06:30", timestamp: "06:30" },
  { id: "07:00", timestamp: "07:00" },
  { id: "07:30", timestamp: "07:30" },
  { id: "08:00", timestamp: "08:00" },
  { id: "08:30", timestamp: "08:30" },
  { id: "09:00", timestamp: "09:00" },
  { id: "09:30", timestamp: "09:30" },
  { id: "10:00", timestamp: "10:00" },
  { id: "10:30", timestamp: "10:30" },
  { id: "11:00", timestamp: "11:00" },
  { id: "11:30", timestamp: "11:30" },
  { id: "12:00", timestamp: "12:00" },
  { id: "12:30", timestamp: "12:30" },
  { id: "13:00", timestamp: "13:00" },
  { id: "13:30", timestamp: "13:30" },
  { id: "14:00", timestamp: "14:00" },
  { id: "14:30", timestamp: "14:30" },
  { id: "15:00", timestamp: "15:00" },
  { id: "15:30", timestamp: "15:30" },
  { id: "16:00", timestamp: "16:00" },
  { id: "16:30", timestamp: "16:30" },
  { id: "17:00", timestamp: "17:00" },
  { id: "17:30", timestamp: "17:30" },
  { id: "18:00", timestamp: "18:00" },
  { id: "18:30", timestamp: "18:30" },
  { id: "19:00", timestamp: "19:00" },
  { id: "19:30", timestamp: "19:30" },
  { id: "20:00", timestamp: "20:00" },
  { id: "20:30", timestamp: "20:30" },
  { id: "21:00", timestamp: "21:00" },
  { id: "21:30", timestamp: "21:30" },
  { id: "22:00", timestamp: "22:00" },
  { id: "22:30", timestamp: "22:30" },
  { id: "23:00", timestamp: "23:00" },
  { id: "23:30", timestamp: "23:30" },
];

const EditDialog = ({
  open,
  handleClose,
  row,
  openedFromWhere,
  handleFetch,
}) => {
  const classes = useStyle();

  const [screenTypeDD, setScreenTypeDD] = useState("print");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [every, setEvery] = useState("Daily");
  const [timeStamps, setTimeStamps] = useState([]);
  const [report, setReport] = useState({
    sendReport: false,
    lastReport: false,
  });
  const [active, setActive] = useState(true);
  const [initialState, setInitialState] = useState(null);
  function boolToYesNo(value) {
    return value ? "Yes" : "No";
  }
  function yesNoToBool(value) {
    return value === "Yes" ? true : false;
  }

  useEffect(() => {
    if (open && openedFromWhere === "edit") {
      const filteredCompanies = row?.scheduledCompanies
        ?.filter((i) => i.isActive)
        .map((i) => i.companyId);

      const initialData = {
        selectedClient: row?.id,
        selectedCompany: filteredCompanies,
        active: yesNoToBool(row?.active),
        every: "Daily",
        timeStamps: row?.schedule
          ?.filter((i) => i.entityType === screenTypeDD)
          .filter((i) => i.isActive)
          ?.map((i) => i.time),
        report: {
          sendReport: yesNoToBool(row?.sendReport),
          lastReport: yesNoToBool(row?.lastReport),
        },
      };

      setSelectedClient(initialData.selectedClient);
      setSelectedCompany(initialData.selectedCompany);
      setActive(initialData.active);
      setEvery(initialData.every);
      setTimeStamps(initialData.timeStamps);
      setReport(initialData.report);
      setInitialState(initialData);
    }
  }, [open, screenTypeDD]);

  const handleCheckboxChange = (event) => {
    setActive(event.target.checked);
  };

  // Fetching data
  const { data: clientData } = useFetchData(`${url}clientlist/`);
  const { data: companyData } = useFetchData(
    selectedClient ? `${url}companylist/${selectedClient}` : ""
  );

  const [updateLoading, setUpdateLoading] = useState(false);
  const [insertLoading, setInsertLoading] = useState(false);

  const handleSave = async () => {
    try {
      setUpdateLoading(true);
      const removedCompanies = initialState.selectedCompany.filter(
        (companyId) => !selectedCompany.includes(companyId)
      );

      const addedCompanies = selectedCompany.filter(
        (companyId) => !initialState.selectedCompany.includes(companyId)
      );

      const removedSlots = initialState?.timeStamps?.filter(
        (stamp) => !timeStamps.includes(stamp)
      );

      const addedSlots = timeStamps.filter(
        (stamp) => !initialState.timeStamps.includes(stamp)
      );

      const hasCompanyChanges =
        removedCompanies.length > 0 || addedCompanies.length > 0;
      const hasSlotChanges = removedSlots.length > 0 || addedSlots.length > 0;

      const hasOtherChanges =
        active !== initialState.active ||
        every !== initialState.every ||
        timeStamps.some(
          (timestamp, index) => timestamp !== initialState.timeStamps[index]
        ) ||
        report.sendReport !== initialState.report.sendReport ||
        report.lastReport !== initialState.report.lastReport;

      const hasChanges = hasCompanyChanges || hasOtherChanges;

      if (!hasChanges) {
        toast.warning("No changes detected, not sending data.");
        return;
      }
      const companyUpdates = [
        ...removedCompanies.map((companyId) => ({
          companyId,
          isActive: false,
        })),
        ...addedCompanies.map((companyId) => ({
          companyId,
          isActive: true,
        })),
      ];
      const slotUpdates = [
        ...removedSlots.map((time) => ({
          time,
          isActive: false,
        })),
        ...addedSlots.map((time) => ({
          time,
          isActive: true,
        })),
      ];

      const token = localStorage.getItem("user");
      const requestData = {
        clientId: selectedClient,
        // companyIds: [{ companyId: "", isActive: "" }],
        // isSendReport: "",
        // isIncludeReport: "",
        // isActive: "",
        // entityType: "",
        // slots: [{ time: "", isActive: "" }],
        // frequency: "",
        updateType: "U",
      };
      if (hasCompanyChanges) {
        requestData.companyIds = companyUpdates;
      }
      if (hasSlotChanges) {
        requestData.slots = slotUpdates;
      }
      if (initialState?.report?.sendReport !== report.sendReport) {
        requestData.isSendReport = boolToYesNo(report.sendReport);
      }
      if (initialState?.report?.lastReport !== report.lastReport) {
        requestData.isIncludeReport = boolToYesNo(report.sendReport);
      }
      if (initialState.active !== active) {
        requestData.isActive = boolToYesNo(active);
      }

      if (screenTypeDD) {
        requestData.entityType = screenTypeDD;
      }
      if (initialState.every !== every || hasSlotChanges) {
        requestData.frequency = every;
      }

      const response = await axios.post(
        `${url_mongo}updateMailerScheduler`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        handleClose();
        handleFetch();
        toast.success("Schedule updated successfully");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInsert = async () => {
    try {
      setInsertLoading(true);
      const client = await clientData.data.clients.find(
        (client) => client.clientid === selectedClient
      );

      const requestData = {
        clientId: client.clientid,
        clientName: client.clientname,
        companyIds: selectedCompany,
        isSendReport: report.sendReport,
        isIncludeReport: report.lastReport,
        entityType: screenTypeDD,
        slots: timeStamps,
        frequency: every,
        updateType: "I",
      };
      const token = localStorage.getItem("user");
      const response = await axios.post(
        `${url_mongo}updateMailerScheduler/`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        handleFetch();
        handleClose();
        toast.success(response.data.scheduleData.status);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setInsertLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      sx={{ "& .MuiDialog-paper": { height: "70vh" } }}
    >
      <DialogTitle fontSize={"1em"}>
        {openedFromWhere === "add" ? "Add" : "Edit"} Item
      </DialogTitle>
      <DialogContent
        sx={{ border: "1px solid #D3D3D3", margin: 2, borderRadius: "3px" }}
      >
        <StyledItemWrapper>
          <StyledText>Client:</StyledText>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-[278px] border border-gray-400 rounded-sm hover:border-black text-sm"
            disabled={openedFromWhere === "edit"}
          >
            <option value="">Select Client</option>
            {clientData?.data?.clients.map((client) => (
              <option
                key={client.clientid}
                value={client.clientid}
                className="text-sm"
              >
                {client.clientname}
              </option>
            ))}
          </select>
        </StyledItemWrapper>
        <StyledItemWrapper>
          <StyledText>Company:</StyledText>
          <CustomMultiSelect
            title="Company"
            dropdownWidth={278}
            dropdownToggleWidth={278}
            keyId="companyid"
            keyName="companyname"
            options={companyData?.data?.companies || []}
            selectedItems={selectedCompany}
            setSelectedItems={setSelectedCompany}
            isIncreased={false}
          />
        </StyledItemWrapper>
        <StyledItemWrapper>
          <StyledText>Screen Type:</StyledText>
          <YesOrNo
            classes={classes}
            mapValue={["online", "print", "both"]}
            placeholder="Screen"
            value={screenTypeDD}
            setValue={setScreenTypeDD}
            width={278}
          />
        </StyledItemWrapper>
        <StyledItemWrapper>
          <StyledText>Send Report Every:</StyledText>
          <Box>
            <YesOrNo
              classes={classes}
              mapValue={["Daily"]}
              placeholder="Every"
              value={every}
              setValue={setEvery}
              width={278}
            />
            <div className="mt-1">
              <CustomMultiSelect
                title="Time stamp"
                dropdownWidth={278}
                dropdownToggleWidth={278}
                keyId="id"
                keyName="timestamp"
                options={timeStampData}
                selectedItems={timeStamps}
                setSelectedItems={setTimeStamps}
                isIncreased={false}
              />
            </div>
          </Box>
        </StyledItemWrapper>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography width={150}>
            Send report even if no new results were found:
          </Typography>
          <YesNoSwitchWrapper>
            {/* Yes/No labels */}
            <CustomSwitch
              checked={report.sendReport}
              onChange={(e) =>
                setReport((prev) => ({ ...prev, sendReport: e.target.checked }))
              }
            />
          </YesNoSwitchWrapper>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography width={150}>
            Only include new results since last report:
          </Typography>
          <YesNoSwitchWrapper>
            <CustomSwitch
              checked={report.lastReport}
              onChange={(e) =>
                setReport((prev) => ({ ...prev, lastReport: e.target.checked }))
              }
            />
          </YesNoSwitchWrapper>
        </Box>
        <Divider sx={{ my: 1 }} />
        {openedFromWhere === "edit" && (
          <StyledItemWrapper>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={active}
                    onChange={handleCheckboxChange}
                    color="primary"
                  />
                }
                label="Active"
              />
            </FormControl>
          </StyledItemWrapper>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} size="small" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={openedFromWhere === "edit" ? handleSave : handleInsert}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {insertLoading ||
            (updateLoading && <CircularProgress size={"1em"} />)}{" "}
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  openedFromWhere: PropTypes.string.isRequired,
  row: PropTypes.object,
  handleFetch: PropTypes.func,
};

export default EditDialog;