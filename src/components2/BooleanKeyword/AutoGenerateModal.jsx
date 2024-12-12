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
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { generateAutoQuery } from "./utils";
import axiosInstance from "../../../axiosConfig";
import toast from "react-hot-toast";

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

const AutoGenerateModal = ({
  open,
  handleClose,
  row,
  language,
  fromWhere,
  selectedFullClient,
  fetchBooleanKeywords,
}) => {
  const [formValues, setFormValues] = useState({
    companyName: "",
    ceo: "",
    products: "",
    keyPeoples: "",
    companyKeywords: "",
    industryKeywords: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialState, setInitialState] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // * get company details
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const companyId =
          fromWhere === "Add" ? selectedFullClient?.companyid : row?.companyId;
        const response = await axiosInstance.get(
          `getCompanyKeywords/?companyId=${companyId}`
        );

        if (response.status === 200) {
          let companyDetails = response.data?.data;
          setInitialState(companyDetails);
          setFormValues({
            companyName: companyDetails?.companyInfo.companyName,
            ceo: companyDetails?.keywordInfo.ceo,
            products: companyDetails?.keywordInfo?.product,
            keyPeoples: companyDetails?.keywordInfo.keyPeople,
            companyKeywords: companyDetails?.keywordInfo.companyKeyword,
            industryKeywords: companyDetails?.keywordInfo.industryKeyword,
          });
        }
      } catch (error) {
        toast.error("Something went wrong.");
      }
    };
    if (open) {
      fetchCompanyDetails();
    }
  }, [open, fromWhere, row?.companyId, selectedFullClient]);

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

  const updateCompanyKeyword = async () => {
    try {
      const requestData = {
        ceo: formValues.ceo,
        keyPeople: formValues.keyPeoples,
        product: formValues.products,
        companyKeyword: formValues.companyKeywords,
        industryKeyword: formValues.industryKeywords,
      };
      let companyId =
        fromWhere === "Add" ? selectedFullClient?.companyid : row?.companyId;
      const response = await axiosInstance.put(
        `updateCompanyKeywords/?companyId=${companyId}`,
        requestData
      );
      console.log(response.data.message.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  const hasFormChanged = () => {
    return (
      formValues.ceo !== initialState.keywordInfo.ceo ||
      formValues.products !== initialState.keywordInfo.product ||
      formValues.keyPeoples !== initialState.keywordInfo.keyPeople ||
      formValues.companyKeywords !== initialState.keywordInfo.companyKeyword ||
      formValues.industryKeywords !== initialState.keywordInfo.industryKeyword
    );
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const query = generateAutoQuery(formValues);

        const requestData = {
          companyId:
            fromWhere === "Add"
              ? selectedFullClient?.companyid
              : row?.companyId,
          companyName:
            fromWhere === "Add"
              ? selectedFullClient?.companyname
              : row?.companyName,
          includeQuery: [
            {
              query,
              langId: language,
            },
          ],
        };

        const response = await axiosInstance.post("newBoolean", requestData);
        if (response.status === 200) {
          toast.success(response.data.data.message);
          handleClose();
          if (hasFormChanged()) {
            await updateCompanyKeyword();
          }
          if (fromWhere === "Edit") {
            fetchBooleanKeywords();
          }
        }
      } catch (error) {
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
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
            value={formValues.companyName || row?.companyName}
            onChange={handleChange}
            error={!!errors.companyName}
            helperText={errors.companyName}
            size="small"
            autoFocus
            placeholder="company name"
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
            placeholder="CEO1,CEO2"
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
            placeholder="product1,product2"
          />
          <StyledTextField
            fullWidth
            label="Key People"
            name="keyPeoples"
            value={formValues.keyPeoples}
            onChange={handleChange}
            multiline
            rows={4}
            error={!!errors.keyPeoples}
            helperText={errors.keyPeoples}
            size="small"
            placeholder="people1,people2"
          />
          <StyledTextField
            fullWidth
            label="Company Keywords"
            name="companyKeywords"
            value={formValues.companyKeywords}
            onChange={handleChange}
            multiline
            rows={4}
            size="small"
            placeholder="companyKeyword1,companyKeyword2"
          />
          <StyledTextField
            fullWidth
            label="Industry Keywords"
            name="industryKeywords"
            value={formValues.industryKeywords}
            onChange={handleChange}
            multiline
            rows={4}
            size="small"
            placeholder="industry1,industry2"
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
          variant={loading ? "outlined" : "contained"}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {loading && <CircularProgress size={"1em"} />}
          validate & include
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

AutoGenerateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  companyName: PropTypes.string,
  row: PropTypes.shape({
    companyId: PropTypes.string,
    companyName: PropTypes.string,
  }),
  language: PropTypes.string,
  fromWhere: PropTypes.string,
  selectedFullClient: PropTypes.object,
  fetchBooleanKeywords: PropTypes.func,
};

export default AutoGenerateModal;
