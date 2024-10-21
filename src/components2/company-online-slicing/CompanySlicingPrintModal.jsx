import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 2,
  marginBottom: "10px",
});

const StyledText = styled(Typography)({
  flexBasis: "200px",
  flexShrink: 0,
  flexGrow: 0,
  textAlign: "right",
  paddingRight: "10px",
  textWrap: "nowrap",
});

const fields = [
  { label: "Source Company", placeholder: "Select Source Company" },
  { label: "Destination Company", placeholder: "Select Destination Company" },
  { label: "Article Min Char", placeholder: "Article Min Char" },
  { label: "Publication Type", placeholder: "Publication Type" },
  { label: "Edition Type", placeholder: "Edition Type" },
  { label: "Minimum Circulation", placeholder: "Minimum Circulation" },
  { label: "Language", placeholder: "Language" },
  { label: "Soft Ignored Keyword", placeholder: "Soft Ignored Keyword" },
  { label: "Hard Ignored Keyword", placeholder: "Hard Ignored Keyword" },
  { label: "Reporting Subject", placeholder: "Reporting Subject" },
  { label: "Boolean Query", placeholder: "Boolean Query" },
];

const CompanySlicingPrintModal = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle fontSize={"1em"}>
        Add/Edit Company Online Slicing
      </DialogTitle>
      <Divider />
      <DialogContent>
        {fields.map((field, index) => (
          <StyledBox key={index}>
            <StyledText variant="body1" color="textSecondary">
              {field.label}:
            </StyledText>
            <TextField label={field.placeholder} fullWidth size="small" />
          </StyledBox>
        ))}
        <StyledBox sx={{ justifyContent: "center" }}>
          <FormControlLabel
            control={<Checkbox />}
            label="Headline Tagged"
            sx={{ flex: 1 }}
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Summary Tagged"
            sx={{ flex: 1 }}
          />
        </StyledBox>
      </DialogContent>
      <Divider />
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

CompanySlicingPrintModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CompanySlicingPrintModal;
