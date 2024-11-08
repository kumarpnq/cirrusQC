import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  TextField,
} from "@mui/material";
import { FixedSizeList as List } from "react-window";
import { styled } from "@mui/system";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "46%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 1,
};

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
const MapExtraModal = ({ open, handleClose }) => {
  /* 
  1>make two virtual lists(AI company & DB company)
  2>make a function to handle the click event of the list item
  3>Function to select company 
  4> Bring set data variable from the main screen.
  5> if data all ready present in that make a unique record after pushing check all data is going correctly or not.
  6> proceed to save in the main api
  
  
  */
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([
    { companyid: "BMW", companyname: "BMW" },
    { companyid: "APPLE", companyname: "APPLE" },
    { companyid: "SAMSUNG", companyname: "Samsung India" },
    { companyid: "SKODA", companyname: "SKODA" },
  ]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const companies = [];

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

  const handleSearchChange = (event) => {
    const value = event?.target?.value?.toLowerCase();
    setSearchQuery(value);

    const filtered = companies.filter((company) =>
      company.companyname.toLowerCase().includes(value)
    );
    setFilteredCompanies(filtered);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          fontSize={"1em"}
        >
          Map Extra
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Paper
            elevation={4}
            sx={{ borderRadius: "10px", padding: "20px", overflow: "hidden" }}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search Ai company..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)",
                },
              }}
            />
            <List
              height={400}
              itemCount={filteredCompanies.length}
              itemSize={60}
              width={300}
            >
              {renderRow}
            </List>
          </Paper>

          <Paper
            elevation={4}
            sx={{ borderRadius: "10px", padding: "20px", overflow: "hidden" }}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search Db company..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)",
                },
              }}
            />
            <List
              height={400}
              itemCount={filteredCompanies.length}
              itemSize={60}
              width={300}
            >
              {renderRow}
            </List>
          </Paper>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box textAlign={"end"}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="primary"
            size="small"
            sx={{ mr: 1 }}
          >
            Close
          </Button>
          <Button variant="outlined" color="primary" size="small">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

MapExtraModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default MapExtraModal;
