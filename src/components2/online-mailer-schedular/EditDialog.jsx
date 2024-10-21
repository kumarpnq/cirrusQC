import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Typography,
  Switch,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";
import { useState } from "react";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";

const StyledItemWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});
const StyledText = styled(Typography)({
  color: "GrayText",
  textWrap: "nowrap",
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
  { id: 1, timestamp: "00:00" },
  { id: 2, timestamp: "00:30" },
  { id: 3, timestamp: "01:00" },
  { id: 4, timestamp: "01:30" },
  { id: 5, timestamp: "02:00" },
  { id: 6, timestamp: "02:30" },
  { id: 7, timestamp: "03:00" },
  { id: 8, timestamp: "03:30" },
  { id: 9, timestamp: "04:00" },
  { id: 10, timestamp: "04:30" },
  { id: 11, timestamp: "05:00" },
  { id: 12, timestamp: "05:30" },
  { id: 13, timestamp: "06:00" },
  { id: 14, timestamp: "06:30" },
  { id: 15, timestamp: "07:00" },
  { id: 16, timestamp: "07:30" },
  { id: 17, timestamp: "08:00" },
  { id: 18, timestamp: "08:30" },
  { id: 19, timestamp: "09:00" },
  { id: 20, timestamp: "09:30" },
  { id: 21, timestamp: "10:00" },
  { id: 22, timestamp: "10:30" },
  { id: 23, timestamp: "11:00" },
  { id: 24, timestamp: "11:30" },
  { id: 25, timestamp: "12:00" },
  { id: 26, timestamp: "12:30" },
  { id: 27, timestamp: "13:00" },
  { id: 28, timestamp: "13:30" },
  { id: 29, timestamp: "14:00" },
  { id: 30, timestamp: "14:30" },
  { id: 31, timestamp: "15:00" },
  { id: 32, timestamp: "15:30" },
  { id: 33, timestamp: "16:00" },
  { id: 34, timestamp: "16:30" },
  { id: 35, timestamp: "17:00" },
  { id: 36, timestamp: "17:30" },
  { id: 37, timestamp: "18:00" },
  { id: 38, timestamp: "18:30" },
  { id: 39, timestamp: "19:00" },
  { id: 40, timestamp: "19:30" },
  { id: 41, timestamp: "20:00" },
  { id: 42, timestamp: "20:30" },
  { id: 43, timestamp: "21:00" },
  { id: 44, timestamp: "21:30" },
  { id: 45, timestamp: "22:00" },
  { id: 46, timestamp: "22:30" },
  { id: 47, timestamp: "23:00" },
  { id: 48, timestamp: "23:30" },
];

const EditDialog = ({ open, setOpen, openedFromWhere }) => {
  const classes = useStyle();
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [every, setEvery] = useState("");
  const [timeStamps, setTimeStamps] = useState([]);
  const [checked, setChecked] = useState(false);
  const [checkedBox, setCheckedBox] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (event) => {
    setCheckedBox(event.target.checked);
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
      sx={{ "& .MuiDialog-paper": { height: "50vh" } }}
    >
      <DialogTitle>
        {openedFromWhere === "add" ? "Add" : "Edit"} Item
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {openedFromWhere === "add"
            ? "Fill out the details to add a new item."
            : "Edit the details of your item here."}
        </DialogContentText>
        <StyledItemWrapper>
          <StyledText>Client:</StyledText>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full border border-gray-400 rounded-sm hover:border-black"
          >
            <option value="">Select Client</option>
            {clientData?.data?.clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </StyledItemWrapper>
        <StyledItemWrapper>
          <StyledText>Company:</StyledText>
          <CustomMultiSelect
            title="Company"
            dropdownWidth={250}
            dropdownToggleWidth={250}
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
            dropdownWidth={250}
            dropdownToggleWidth={250}
            keyId="id"
            keyName="timestamp"
            options={timeStampData}
            selectedItems={timeStamps}
            setSelectedItems={setTimeStamps}
            isIncreased={false}
          />
        </StyledItemWrapper>
        <StyledItemWrapper>
          <StyledText>
            Send report even if no new results were found:
          </StyledText>
          <YesNoSwitchWrapper>
            {/* Yes/No labels */}
            <Typography
              variant="body1"
              color={checked ? "textSecondary" : "textPrimary"}
              sx={{ fontWeight: checked ? 400 : 600 }}
            >
              No
            </Typography>
            <CustomSwitch checked={checked} onChange={handleChange} />
            <Typography
              variant="body1"
              color={checked ? "textPrimary" : "textSecondary"}
              sx={{ fontWeight: checked ? 600 : 400 }}
            >
              Yes
            </Typography>
          </YesNoSwitchWrapper>
        </StyledItemWrapper>
        <StyledItemWrapper>
          <StyledText>Only include new results since last report:</StyledText>
          <YesNoSwitchWrapper>
            {/* Yes/No labels */}
            <Typography
              variant="body1"
              color={checked ? "textSecondary" : "textPrimary"}
              sx={{ fontWeight: checked ? 400 : 600 }}
            >
              No
            </Typography>
            <CustomSwitch checked={checked} onChange={handleChange} />
            <Typography
              variant="body1"
              color={checked ? "textPrimary" : "textSecondary"}
              sx={{ fontWeight: checked ? 600 : 400 }}
            >
              Yes
            </Typography>
          </YesNoSwitchWrapper>
        </StyledItemWrapper>
        {openedFromWhere === "edit" && (
          <StyledItemWrapper>
            <StyledText>Active:</StyledText>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedBox}
                    onChange={handleCheckboxChange}
                    color="primary"
                  />
                }
                label="Default Checked"
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
  setOpen: PropTypes.func.isRequired,
  openedFromWhere: PropTypes.string.isRequired,
};

export default EditDialog;
