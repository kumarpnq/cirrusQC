import { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Button,
  Typography,
  FormControl,
  Divider,
  Paper,
} from "@mui/material";
import CustomTextField from "../../@core/CutsomTextField";
import { styled } from "@mui/system";
import { makeStyles } from "@mui/styles";
import YesOrNo from "../../@core/YesOrNo";

const StyledFormControl = styled(FormControl)({
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  gap: 2,
});

const StyledTypo = styled(Typography)({
  textTransform: "uppercase",
  letterSpacing: "1px",
  textWrap: "nowrap",
  width: 300,
  color: "gray",
});

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));

const CompanyFormModal = ({ open, handleClose, rowId }) => {
  const classes = useStyle();
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [parentCompany, setParentCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [shortCompany, setShortCompany] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [qc3, setQc3] = useState("");
  const [country, setCountry] = useState("");
  const [active, setActive] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(rowId);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          border: "1px solid #000",
          boxShadow: 24,
          p: 1.5,
          height: 530,
          //   overflow: "scroll",
        }}
      >
        <Typography
          variant="h6"
          component={Paper}
          fontSize={"1em"}
          mb={1}
          px={1}
        >
          Add/Edit Company Master
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              border: "1px solid #D3D3D3",
              padding: 2,
              borderRadius: "3px",
            }}
          >
            <StyledFormControl fullWidth margin="normal">
              <StyledTypo variant="body2">Company ID : </StyledTypo>
              <CustomTextField
                value={companyId}
                setValue={setCompanyId}
                placeholder={"Company ID"}
                type={"text"}
              />
            </StyledFormControl>

            <StyledFormControl fullWidth margin="normal">
              <StyledTypo variant="body2">Company Name : </StyledTypo>
              <CustomTextField
                value={companyName}
                setValue={setCompanyName}
                placeholder={"Company Name"}
                type={"text"}
              />
            </StyledFormControl>

            <StyledFormControl fullWidth margin="normal">
              <StyledTypo variant="body2"> Parent Company : </StyledTypo>
              <CustomTextField
                value={parentCompany}
                setValue={setParentCompany}
                placeholder={"Parent Company"}
                type={"text"}
              />
            </StyledFormControl>

            <StyledFormControl fullWidth margin="normal">
              <StyledTypo variant="body2">Short Company : </StyledTypo>
              <CustomTextField
                value={shortCompany}
                setValue={setShortCompany}
                placeholder={"Search Text"}
                type={"text"}
              />
            </StyledFormControl>

            <StyledFormControl fullWidth margin="normal">
              <StyledTypo variant="body2">Industry : </StyledTypo>
              <YesOrNo
                classes={classes}
                value={industry}
                setValue={setIndustry}
                placeholder="Industry"
                mapValue={[
                  "Technology",
                  "Healthcare",
                  "Finance",
                  "Energy",
                  "Retail",
                ]}
              />
            </StyledFormControl>

            <StyledFormControl fullWidth margin="normal">
              <StyledTypo variant="body2">Subcategory : </StyledTypo>

              <YesOrNo
                classes={classes}
                value={subcategory}
                setValue={setSubcategory}
                placeholder="Sub Category"
                mapValue={["YES", "NO"]}
              />
            </StyledFormControl>

            <StyledFormControl fullWidth margin="normal">
              <StyledTypo variant="body2">QC3 : </StyledTypo>
              <YesOrNo
                classes={classes}
                value={qc3}
                setValue={setQc3}
                placeholder="QC3"
                mapValue={["YES", "NO"]}
              />
            </StyledFormControl>

            <StyledFormControl fullWidth margin="normal">
              <StyledTypo variant="body2">Country : </StyledTypo>
              <YesOrNo
                classes={classes}
                value={country}
                setValue={setCountry}
                placeholder="Country"
                mapValue={["India", "Japan", "Brazil", "Germany", "Canada"]}
              />
            </StyledFormControl>

            <StyledFormControl fullWidth margin="normal">
              <StyledTypo variant="body2">Active : </StyledTypo>
              <YesOrNo
                classes={classes}
                value={active}
                setValue={setActive}
                placeholder="IsActive"
                mapValue={["YES", "NO"]}
              />
            </StyledFormControl>
          </Box>
          <Divider sx={{ mt: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "end", mt: 1, gap: 1 }}>
            <Button variant="outlined" onClick={handleClose} sx={{ ml: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" className="bg-primary">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

CompanyFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  rowId: PropTypes.any,
};

export default CompanyFormModal;
