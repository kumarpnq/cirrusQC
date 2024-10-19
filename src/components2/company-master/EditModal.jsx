import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Button,
  Typography,
  FormControl,
  Divider,
  Paper,
  CircularProgress,
} from "@mui/material";
import CustomTextField from "../../@core/CutsomTextField";
import { styled } from "@mui/system";
import { makeStyles } from "@mui/styles";
import YesOrNo from "../../@core/YesOrNo";
import { url } from "../../constants/baseUrl";
import useFetchData from "../../hooks/useFetchData";
import axios from "axios";
import { toast } from "react-toastify";

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

const CompanyFormModal = ({ open, handleClose, rowId, isEdit }) => {
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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && isEdit) {
      setCompanyId(rowId?.companyId || "");
      setCompanyName(rowId?.companyName || "");
      setParentCompany(rowId?.parentCompany || "");
      setIndustry(rowId?.industry || "");
      setShortCompany(rowId?.shortCompany || "");
      setSubcategory(rowId?.hasSubcategory === "Yes" ? "YES" : "NO" || "");
      setQc3(rowId?.qc3 || "");
      setCountry(rowId?.countryId || "");
      setActive(rowId?.isActive === "Y" ? "YES" : "NO" || "");
    }
  }, [open]);

  const { data: industryData } = useFetchData(
    `${url}companymasterddl/?listType=${"industry"}`
  );
  const { data: companyData } = useFetchData(
    `${url}companymasterddl/?listType=${"country"}`
  );
  const industryDataArray = industryData?.data?.ddl || [];
  const countryDataArray = companyData?.data?.ddl || [];

  function yesNo(key) {
    switch (key) {
      case "YES":
        return "Y";
      case "NO":
        return "N";
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isEdit) {
      if (
        !companyId ||
        !companyName ||
        !parentCompany ||
        !industry ||
        !shortCompany ||
        !subcategory ||
        !qc3 ||
        !country ||
        !active
      ) {
        toast.warning("All fields are required.");
        return;
      }
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("user");
      const updateType = isEdit ? "U" : "I";
      const requestData = {
        companyName,
        companyId,
        parentCompany,
        industry,
        shortCompany,
        hasSubcategory: yesNo(subcategory),
        qc3: yesNo(qc3),
        country: Number(country),
        active: yesNo(active),
        updateType,
      };
      const response = await axios.post(
        `${url}updatecompanymaster`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!isEdit) {
        toast.success(response.data.updateStatus.status);
      } else {
        toast.success("Data updated.");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
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
              <select
                name=""
                id=""
                className="w-full text-sm text-gray-500 border border-gray-400 rounded-sm hover:border-black"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">Select Industry</option>
                {industryDataArray.map((item) => (
                  <option key={item.industry} value={item.industry}>
                    {item.industry}
                  </option>
                ))}
              </select>
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
              <select
                name=""
                id=""
                className="w-full text-sm text-gray-500 border border-gray-400 rounded-sm hover:border-black"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select Country</option>
                {countryDataArray.map((item) => (
                  <option key={item.countryId} value={item.countryId}>
                    {item.countryName}
                  </option>
                ))}
              </select>
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
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ ml: 2 }}
              size={"small"}
            >
              Cancel
            </Button>
            <Button
              variant={!loading && "contained"}
              type="submit"
              className="bg-primary"
              size="small"
            >
              {loading && <CircularProgress size={"1em"} />}{" "}
              {isEdit ? "Update" : "Insert"}
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
  isEdit: PropTypes.bool,
};

export default CompanyFormModal;
