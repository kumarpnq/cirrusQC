import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
  Typography,
  Link,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import SearchDropdown from "../../@core/DebounceMUICompany";
import DebounceSearchCompany from "../../@core/DebounceSearchCompany";

const ManualAddPopup = ({ open, onClose, setData }) => {
  //   const [socialFeedId, setSocialFeedId] = useState("");
  const [date, setDate] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [link, setLink] = useState("");
  const [records, setRecords] = useState([]);
  const [linkError, setLinkError] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const validateLink = (url) => {
    const regex =
      /^(https?:\/\/)?([\w\d-]+\.){1,}[\w\d-]{2,}(:\d{2,5})?(\/\S*)?$/;
    return regex.test(url);
  };

  const handleLinkChange = (e) => {
    const url = e.target.value;
    setLink(url);

    // Check for valid URL
    if (!validateLink(url)) {
      setLinkError(true);
    } else {
      setLinkError(false);
    }
  };

  const handleAddRecord = () => {
    setRecords([
      ...records,
      { Date: date, CompanyName: companyName, Link: link },
    ]);
    // setSocialFeedId("");
    // setDate("");
    // setCompanyName("");
    // setLink("");
  };

  const handleAddRecords = () => {
    setData((prev) => [...records, ...prev]);
  };

  const handleDeleteRecord = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Manual Add</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <DebounceSearchCompany
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
            />
            <SearchDropdown />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              fullWidth
              margin="dense"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company Name"
              fullWidth
              margin="dense"
              size="small"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Link"
              fullWidth
              margin="dense"
              size="small"
              value={link}
              onChange={handleLinkChange}
              error={linkError}
              helperText={linkError ? "Please enter a valid URL" : ""}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRecord}
          sx={{ mt: 2 }}
        >
          Add Record
        </Button>

        <List sx={{ mt: 2, maxHeight: 300, overflowY: "scroll" }}>
          {records.map((record, index) => (
            <ListItem
              key={index}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                mb: 1,
                p: 1,
                bgcolor: "#fff",
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    component={"div"}
                    display={"flex"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <span className="text-gray-400">{record.socialFeedId}</span>
                    <span className="text-gray-400">{record.Date}</span>
                    <span className="text-gray-400">{record.CompanyName}</span>
                    <Link
                      href={record.Link || ""}
                      target="_blank"
                      rel="noopener"
                    >
                      {record.Link}
                    </Link>
                  </Typography>
                }
              />

              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteRecord(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button color="primary" onClick={handleAddRecords}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ManualAddPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
};

export default ManualAddPopup;
