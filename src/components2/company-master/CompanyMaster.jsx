import { Box, Divider } from "@mui/material";
import SearchFilters from "./SearchFilters";
import DataGrid from "./DataGrid";
import { useState } from "react";

const CompanyMaster = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  return (
    <Box>
      <SearchFilters
        setCompanies={setCompanies}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <Divider sx={{ my: 1 }} />
      <DataGrid data={companies} setSelectedRows={setSelectedRows} />
    </Box>
  );
};

export default CompanyMaster;
