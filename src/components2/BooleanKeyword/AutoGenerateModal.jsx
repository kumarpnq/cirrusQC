import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { generateAutoQuery } from "./utils";

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "12px",
    padding: theme.spacing(1),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: theme.spacing(0.5),
}));

const AutoGenerateModal = ({ open, handleClose, companyName }) => {
  const [formValues, setFormValues] = useState({
    companyName,
    ceo: "",
    products: "",
    keyPeoples: "",
    companyKeywords: "",
  });

  let testObj = {
    companyName: "Perception & Quant",
    ceo: "Saurav De",
    products: "Media & Research",
    keyPeoples: "Kumar,Sidd,Tushar",
    companyKeywords: "News,charts,emailAlerts",
  };

  useEffect(() => {
    if (open) {
      setFormValues(testObj);
    }
  }, [open]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formValues.companyName)
      tempErrors.companyName = "Company name is required.";
    if (!formValues.ceo) tempErrors.ceo = "CEO name is required.";
    if (!formValues.products)
      tempErrors.products = "Products/Brands are required.";
    if (!formValues.keyPeoples)
      tempErrors.keyPeoples = "Key peoples are required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const response = generateAutoQuery(formValues);
      console.log(response);

      alert(`Generated OR Query:\n${response}`);
    }
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <StyledTypography variant="h6" fontSize={"1em"}>
          Auto Generate Booleans.
        </StyledTypography>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ border: "1px solid #ddd", borderRadius: "3px", padding: 1 }}
          className="shadow-lg"
        >
          <StyledTextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={formValues.companyName || companyName}
            onChange={handleChange}
            error={!!errors.companyName}
            helperText={errors.companyName}
            size="small"
            autoFocus
          />
          <StyledTextField
            fullWidth
            label="CEO"
            name="ceo"
            value={formValues.ceo}
            onChange={handleChange}
            error={!!errors.ceo}
            helperText={errors.ceo}
            size="small"
          />
          <StyledTextField
            fullWidth
            label="Products/Brands"
            name="products"
            value={formValues.products}
            onChange={handleChange}
            multiline
            rows={4}
            error={!!errors.products}
            helperText={errors.products}
            size="small"
          />
          <StyledTextField
            fullWidth
            label="Key Peoples"
            name="keyPeoples"
            value={formValues.keyPeoples}
            onChange={handleChange}
            multiline
            rows={4}
            error={!!errors.keyPeoples}
            helperText={errors.keyPeoples}
            size="small"
          />
          <StyledTextField
            fullWidth
            label="Key Peoples"
            name="keyPeoples"
            value={formValues.companyKeywords}
            onChange={handleChange}
            multiline
            rows={4}
            error={!!errors.companyKeywords}
            helperText={errors.companyKeywords}
            size="small"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} size="small" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          size="small"
          color="primary"
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

AutoGenerateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  companyName: PropTypes.string,
};

export default AutoGenerateModal;
