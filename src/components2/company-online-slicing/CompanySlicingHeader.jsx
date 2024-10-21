import { Box, Button, Paper } from "@mui/material";
import { useState } from "react";
import Client from "../../print-components/dropdowns/Client";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import CompanySlicingModal from "./CompanySlicingEdit";
import CompanySlicingPrintModal from "./CompanySlicingPrintModal";

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 2,
});
const CompanySlicingHeader = ({ activeTab }) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledBox component={Paper}>
        <Client
          label="Client"
          client={selectedClient}
          setClient={setSelectedClient}
          width={300}
          setCompanies={setSelectedCompanies}
        />
        <Button variant="outlined" size="small">
          Search
        </Button>
        <Button variant="outlined" size="small">
          Reset
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setOpen((prev) => !prev)}
        >
          Add
        </Button>
      </StyledBox>
      {!activeTab ? (
        <CompanySlicingModal open={open} handleClose={handleClose} />
      ) : (
        <CompanySlicingPrintModal open={open} handleClose={handleClose} />
      )}
    </>
  );
};

CompanySlicingHeader.propTypes = {
  activeTab: PropTypes.number.isRequired,
};

export default CompanySlicingHeader;
