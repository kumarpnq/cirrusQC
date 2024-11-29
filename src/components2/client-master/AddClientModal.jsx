import { useRef, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Typography,
  Divider,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Box,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import * as XLSX from "xlsx";
import { format, addYears } from "date-fns";
import DownloadIcon from "@mui/icons-material/Download";
import ClearIcon from "@mui/icons-material/Clear";

const AddClientModal = ({ open, onClose }) => {
  const [clientName, setClientName] = useState("");
  const [subscriptionDate, setSubscriptionDate] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(addYears(new Date(), 2), "yyyy-MM-dd"),
  });
  const [companyId, setCompanyId] = useState("");
  const [emailId, setEmailId] = useState("");
  const [excelData, setExcelData] = useState({
    company: [{ companyId: "", companyName: "" }],
    emails: [],
  });
  const [excelError, setExcelError] = useState("");
  const [emails, setEmails] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const binaryString = evt.target.result;
        const wb = XLSX.read(binaryString, { type: "binary" });

        const companySheet = wb.Sheets[wb.SheetNames[0]];
        const companyData = XLSX.utils.sheet_to_json(companySheet, {
          header: 1,
        });

        const emailsSheet = wb.Sheets[wb.SheetNames[1]];
        const emailsData = XLSX.utils.sheet_to_json(emailsSheet, {
          header: 1,
        });

        const company = companyData.slice(1).map((row) => ({
          companyId: row[0],
          companyName: row[1],
        }));

        const emails = emailsData.slice(1).map((row) => ({
          email: row[0],
        }));

        setEmails(emails.map((i) => i.email));

        setCompanyId(company.map((i) => i.companyName).join(","));
        setExcelData({ company, emails });
      };
      reader.readAsBinaryString(file);
    } else {
      setExcelError("Please upload a valid Excel file");
    }
  };

  const handleSave = () => {
    console.log({
      clientName,
      companyId,
      emailId,
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

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setExcelData({
      company: [{ companyId: "", companyName: "" }],
      emails: [],
    });
  };
  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? "simple-popover" : undefined;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Client</DialogTitle>
      <DialogContent
        sx={{ border: "1px solid #DDD", borderRadius: "3px", p: 1, m: 1 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              upload data via Excel
            </Typography>

            <TextField
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              size="small"
              inputRef={fileInputRef}
              InputProps={{
                endAdornment: (
                  <>
                    <InputAdornment position="end">
                      <Tooltip title="Clear File" placement="top">
                        <IconButton
                          onClick={handleClearFile}
                          sx={{ padding: 0 }}
                          color="error"
                        >
                          <ClearIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>

                    <InputAdornment position="end">
                      <Tooltip title="Download Samplebook" placement="top">
                        <IconButton
                          component="a"
                          href="/newClientSamplebook.xlsx"
                          download="newClientSamplebook.xlsx"
                          sx={{ padding: 0 }}
                          color="primary"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  </>
                ),
              }}
              fullWidth
            />
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
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                label="Start Date"
                value={subscriptionDate.startDate}
                onChange={(e) =>
                  setSubscriptionDate((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                required
                size="small"
              />
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                label="End Date"
                value={subscriptionDate.endDate}
                onChange={(e) =>
                  setSubscriptionDate((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                required
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Companies"
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
                    <IconButton
                      onClick={handleClickMailIcon}
                      color={emails?.length ? "primary" : "default"}
                    >
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
