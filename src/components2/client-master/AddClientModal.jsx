import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Divider,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import * as XLSX from "xlsx";

const AddClientModal = ({ open, onClose }) => {
  const [clientName, setClientName] = useState("");
  const [sub, setSub] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [emailId, setEmailId] = useState("");
  const [mailerFormat, setMailerFormat] = useState("");
  const [mailerTime, setMailerTime] = useState("");
  const [excelData, setExcelData] = useState(null);
  const [excelError, setExcelError] = useState("");
  const [emails, setEmails] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const binaryString = evt.target.result;
        const wb = XLSX.read(binaryString, { type: "binary" });
        const wsname = wb.SheetNames[0]; // Get the first sheet
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }); // Convert the sheet to JSON (rows)
        setExcelData(data); // Store the data from Excel
      };
      reader.readAsBinaryString(file);
    } else {
      setExcelError("Please upload a valid Excel file");
    }
  };

  const handleSave = () => {
    console.log({
      clientName,
      sub,
      companyId,
      emailId,
      mailerFormat,
      mailerTime,
    });
    onClose();
  };

  const handleEmailChange = (e) => {
    setEmailId(e.target.value);
  };

  const handleAddEmails = () => {
    const newEmails = emailId
      .split(/[,;]\s*/)
      .map((email) => email.trim())
      .filter((email) => email);
    setEmails([...emails, ...newEmails]);
    setEmailId("");
  };

  const handleClickMailIcon = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? "simple-popover" : undefined;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Client</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Or, you can upload data via Excel
            </Typography>

            <TextField
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              size="small"
            />

            {excelError && (
              <Typography color="error" variant="body2">
                {excelError}
              </Typography>
            )}
            {excelData && (
              <Typography variant="body2" color="primary">
                Excel data loaded: {excelData.length} rows.
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Client Name"
              fullWidth
              variant="outlined"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Sub"
              fullWidth
              variant="outlined"
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Company ID"
              fullWidth
              variant="outlined"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                label="Email IDs"
                fullWidth
                variant="outlined"
                type="email"
                value={emailId}
                onChange={handleEmailChange}
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <IconButton onClick={handleClickMailIcon}>
                      <MailIcon />
                    </IconButton>
                  ),
                }}
              />
              <Button
                onClick={handleAddEmails}
                size="medium"
                variant="outlined"
              >
                Add
              </Button>
              <Popover
                id={popoverId}
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <List>
                  {emails.map((email, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={<a href={`mailto:${email}`}>{email}</a>}
                      />
                    </ListItem>
                  ))}
                </List>
              </Popover>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Mailer Format</InputLabel>
              <Select
                value={mailerFormat}
                onChange={(e) => setMailerFormat(e.target.value)}
                label="Mailer Format"
                required
                size="small"
              >
                <MenuItem value="html">HTML</MenuItem>
                <MenuItem value="text">Text</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Mailer Time</InputLabel>
              <Select
                value={mailerTime}
                onChange={(e) => setMailerTime(e.target.value)}
                label="Mailer Time"
                required
                size="small"
              >
                <MenuItem value="morning">Morning</MenuItem>
                <MenuItem value="afternoon">Afternoon</MenuItem>
                <MenuItem value="evening">Evening</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} size="small" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} size="small" variant="outlined">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddClientModal;
