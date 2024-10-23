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
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";
import { useEffect, useState } from "react";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import { yesOrNo } from "../../constants/dataArray";

const StyledItemWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 1,
  marginTop: 2,
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

const EditDialog = ({ open, handleClose, row, openedFromWhere }) => {
  const classes = useStyle();
  const [screenType, setScreenType] = useState({
    print: false,
    online: false,
    both: false,
  });
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [every, setEvery] = useState("");
  const [timeStamps, setTimeStamps] = useState([]);
  const [report, setReport] = useState({
    sendReport: false,
    lastReport: false,
  });

  const [active, setActive] = useState(true);

  function yesNo(val) {
    if (val === true) return "Yes";
    else return "No";
  }
  useEffect(() => {
    if (open && openedFromWhere === "edit") {
      setSelectedClient(row?.id);
      setSelectedCompany(row?.scheduledCompanies?.map((i) => i.companyId));
      setActive(yesNo(row?.active));
      setEvery(row?.every === 1 ? "Daily" : "Monthly");
      setTimeStamps(row?.schedule?.map((i) => i.time));
      setReport({
        sendReport: yesNo(row?.sendReport),
        lastReport: yesNo(row?.lastReport),
      });
    }
  }, [open]);

  const handleCheckboxChange = (event) => {
    setActive(event.target.checked);
  };

  // Fetching data
  const { data: clientData } = useFetchData(`${url}clientlist/`);
  const { data: companyData } = useFetchData(
    selectedClient ? `${url}companylist/${selectedClient}` : ""
  );

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
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={screenType.print}
                onChange={(e) => {
                  setScreenType({ ...screenType, print: e.target.checked });
                }}
              />
            }
            label="Print"
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={screenType.online}
                onChange={(e) => {
                  setScreenType({ ...screenType, online: e.target.checked });
                }}
              />
            }
            label="Online"
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={screenType.both}
                onChange={(e) => {
                  setScreenType({ ...screenType, both: e.target.checked });
                }}
              />
            }
            label="Both"
          />
        </StyledItemWrapper>
        <StyledItemWrapper>
          <StyledText>Client:</StyledText>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-[278px] border border-gray-400 rounded-sm hover:border-black"
            disabled={openedFromWhere === "edit"}
          >
            <option value="">Select Client</option>
            {clientData?.data?.clients.map((client) => (
              <option key={client.clientid} value={client.clientid}>
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
          <StyledText>Send Report Every:</StyledText>
          <YesOrNo
            classes={classes}
            mapValue={["Daily"]}
            placeholder="Every"
            value={every}
            setValue={setEvery}
            width={"100%"}
          />
          <CustomMultiSelect
            title="Time stamp"
            dropdownWidth={200}
            dropdownToggleWidth={200}
            keyId="id"
            keyName="timestamp"
            options={timeStampData}
            selectedItems={timeStamps}
            setSelectedItems={setTimeStamps}
            isIncreased={false}
          />
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
          onClick={handleClose}
          size="small"
          variant="contained"
          color="primary"
        >
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
};

export default EditDialog;
