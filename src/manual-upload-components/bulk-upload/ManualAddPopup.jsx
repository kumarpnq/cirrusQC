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
import DebounceSearchCompany from "../../@core/DebounceSearchCompany";
import { format, parse } from "date-fns";
import { toast } from "react-toastify";

const ManualAddPopup = ({ open, onClose, setData }) => {
  // Initialize with today's date in 'yyyy-MM-dd' format
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [link, setLink] = useState("");
  const [records, setRecords] = useState([]);
  const [linkError, setLinkError] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");

  const formatSelectedCompanies = () => {
    return selectedCompany.map((company) => company.value).join(",");
  };
  const formatSelectedCompaniesLabel = () => {
    return selectedCompany.map((company) => company.label).join(",");
  };

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

  const handleAddRecord = (event) => {
    event.preventDefault();
    const isDuplicate = records.some((record) => record.Link === link);

    if (isDuplicate) {
      toast.warning("A record with this link already exists.");
      return;
    }

    setRecords([
      ...records,
      {
        Date: date,
        CompanyID: formatSelectedCompanies(),
        CompanyName: formatSelectedCompaniesLabel(),
        Link: link,
        Headline: headline,
        Summary: summary,
      },
    ]);

    // Clear the fields after adding
    // setDate("");
    setLink("");
    setHeadline("");
    setSummary("");
    // setSelectedCompany([]);
  };

  const handleAddRecords = () => {
    setData((prev) => [...records, ...prev]);
  };

  const handleDeleteRecord = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    try {
      const parsedDate = parse(newDate, "yyyy-MM-dd", new Date());
      setDate(format(parsedDate, "yyyy-MM-dd"));
    } catch (error) {
      console.error("Error parsing date:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Manual Add</DialogTitle>
      <DialogContent sx={{ height: 330 }}>
        <form onSubmit={handleAddRecord}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                fullWidth
                margin="dense"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={handleDateChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DebounceSearchCompany
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
                isMultiple
                width={"100%"}
                height={"h-10"}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Headline"
                fullWidth
                margin="dense"
                size="small"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Summary"
                fullWidth
                margin="dense"
                size="small"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Link"
                fullWidth
                margin="dense"
                size="small"
                value={link}
                required
                onChange={handleLinkChange}
                error={linkError}
                helperText={linkError ? "Please enter a valid URL" : ""}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Add Record
          </Button>
        </form>

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
                    textOverflow={"ellipsis"}
                  >
                    <span className="text-gray-400">{record.Date}</span>
                    <span className="text-gray-400">{record.CompanyName}</span>
                    <Link
                      href={record.Link || ""}
                      target="_blank"
                      rel="noopener"
                    >
                      {record.Link}
                    </Link>
                    <span>{record.Headline}</span>
                    <span>{record.Summary}</span>
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
        <Button
          onClick={onClose}
          color="primary"
          size="small"
          variant="outlined"
        >
          Close
        </Button>
        <Button
          color="primary"
          size="small"
          variant="outlined"
          onClick={handleAddRecords}
        >
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
