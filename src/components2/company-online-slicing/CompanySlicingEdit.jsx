import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Divider,
  Box,
  Typography,
  TextField,
} from "@mui/material";

const CompanySlicingModal = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle fontSize={"1em"}>
        Add/Edit Company Online Slicing
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ textWrap: "nowrap" }}
          >
            Source Company :{" "}
          </Typography>
          <TextField label="Select Source Company" fullWidth size="small" />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ textWrap: "nowrap" }}
          >
            Destination Company :{" "}
          </Typography>
          <TextField label="Select Source Company" fullWidth size="small" />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <TextField label="Enter caption" fullWidth size="small" />
          <TextField fullWidth size="small" type="file" />
          <Button
            variant="outlined"
            size="small"
            style={{ textWrap: "nowrap" }}
          >
            Select
          </Button>
          <Button variant="outlined" size="small">
            Add
          </Button>
          <Button variant="outlined" size="small">
            Remove
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" size="small">
          Save
        </Button>
        <Button onClick={handleClose} variant="outlined" size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CompanySlicingModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CompanySlicingModal;
