import { Box, Divider } from "@mui/material";
import SearchFilters from "../components2/client-master/SearchFilters";
import ClientMasterGrid from "../components2/client-master/ClientMasterGrid";

const ClientMaster = () => {
  return (
    <Box sx={{ px: 1 }}>
      <SearchFilters />
      <Divider sx={{ my: 1 }} />
      <ClientMasterGrid />
    </Box>
  );
};

export default ClientMaster;
