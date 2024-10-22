import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const StyledText = styled(Typography)({
  fontSize: "1em",
  color: "GrayText",
  width: "150px",
});

const WhatsAppEditDialog = ({ open, handleClose, openedFromWhere }) => {
  const [client, setClient] = useState("");
  const [company, setCompany] = useState("");
  const [slots, setSlots] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [contacts, setContacts] = useState("");
  const [isPrint, setIsPrint] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const handleSubmit = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Contacts</DialogTitle>

      <DialogContent dividers>
        <StyledBox>
          <StyledText>Client :</StyledText>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Client</InputLabel>
            <Select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              size="small"
            >
              <MenuItem value={1}>Client 1</MenuItem>
              <MenuItem value={2}>Client 2</MenuItem>
            </Select>
          </FormControl>
        </StyledBox>

        <StyledBox>
          <StyledText>Company :</StyledText>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Company</InputLabel>
            <Select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              size="small"
            >
              <MenuItem value={1}>Company 1</MenuItem>
              <MenuItem value={2}>Company 2</MenuItem>
            </Select>
          </FormControl>
        </StyledBox>

        <StyledBox>
          <StyledText>Slots :</StyledText>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Slots</InputLabel>
            <Select
              value={slots}
              onChange={(e) => setSlots(e.target.value)}
              size="small"
            >
              <MenuItem value={1}>Slot 1</MenuItem>
              <MenuItem value={2}>Slot 2</MenuItem>
            </Select>
          </FormControl>
        </StyledBox>

        <StyledBox>
          <StyledText>Time Zone :</StyledText>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Time Zone</InputLabel>
            <Select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              size="small"
            >
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="EST">EST</MenuItem>
              <MenuItem value="PST">PST</MenuItem>
            </Select>
          </FormControl>
        </StyledBox>

        <StyledBox>
          <StyledText>Contacts :</StyledText>
          <TextField
            fullWidth
            label="Enter Contacts"
            multiline
            rows={4}
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            margin="normal"
            size="small"
          />
        </StyledBox>

        <FormControlLabel
          control={
            <Checkbox
              checked={isPrint}
              onChange={(e) => setIsPrint(e.target.checked)}
            />
          }
          label="Is Print"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isOnline}
              onChange={(e) => setIsOnline(e.target.checked)}
            />
          }
          label="Is Online"
        />
        {openedFromWhere === "edit" && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isOnline}
                onChange={(e) => setIsOnline(e.target.checked)}
              />
            }
            label="Is Active"
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleClose} size="small">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} size="small">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

WhatsAppEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  openedFromWhere: PropTypes.string.isRequired,
};

export default WhatsAppEditDialog;
