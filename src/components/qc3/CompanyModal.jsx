import { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import CheckIcon from "@mui/icons-material/Check";
import InfoIcon from "@mui/icons-material/Info";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";

// Styled modal box
const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
  p: 4,
  outline: "none",
  maxHeight: "90vh",
  overflow: "hidden",
  background: "#fff",
}));

// Styled item container
const ItemContainer = styled(Box)(({ theme, selected }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: selected ? "#e0f7fa" : "#f9f9f9",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "10px",
  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.02)",
  },
  cursor: "pointer",
}));

const CompanyModal = ({ open, handleClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const {
    data: companyData,
    isLoading,
    error,
  } = useFetchData(`${url}companylist/`);

  const companies = companyData?.data?.companies || [];

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchQuery(value);

    const filtered = companies.filter((company) =>
      company.companyname.toLowerCase().includes(value)
    );
    setFilteredCompanies(filtered);
  };

  useEffect(() => {
    if (companies.length > 0) {
      setFilteredCompanies(companies);
    }
  }, [companies]);

  const handleSelectCompany = (company) => {
    setSelectedCompany(
      company.companyid === selectedCompany?.companyid ? null : company
    );
  };

  const renderRow = ({ index, style }) => {
    const company = filteredCompanies[index];
    const isSelected = selectedCompany?.companyid === company.companyid;

    return (
      <ItemContainer
        key={company.companyid}
        style={style}
        selected={isSelected}
        onClick={() => handleSelectCompany(company)}
      >
        <Typography variant="body1">{company.companyname}</Typography>
        {isSelected && <CheckIcon color="primary" />}{" "}
      </ItemContainer>
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="company-modal-title"
      aria-describedby="company-modal-description"
    >
      <StyledModalBox>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          px={2}
        >
          <Typography
            id="company-modal-title"
            variant="h5"
            component="h2"
            fontSize={"1em"}
          >
            Company List
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box px={2} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search company..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)",
              },
            }}
          />
          <Tooltip title="Beam Me to the Company">
            <IconButton
              sx={{ ml: 1 }}
              onClick={() => setSearchQuery(selectedCompany?.companyname || "")}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Paper
          elevation={4}
          sx={{ borderRadius: "10px", padding: "20px", overflow: "hidden" }}
        >
          {isLoading ? (
            <Typography variant="body2">Loading companies...</Typography>
          ) : error ? (
            <Typography variant="body2" color="error">
              Error fetching companies
            </Typography>
          ) : (
            <List
              height={400}
              itemCount={filteredCompanies.length}
              itemSize={60}
              width="100%"
            >
              {renderRow}
            </List>
          )}
        </Paper>
      </StyledModalBox>
    </Modal>
  );
};

export default CompanyModal;
