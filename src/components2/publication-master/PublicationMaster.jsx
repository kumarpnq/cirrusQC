import { Box, Divider } from "@mui/material";
import SearchFilters from "./SearchFilters";
import PublicationGrid from "./PublicationGrid";

const PublicationMaster = () => {
  return (
    <Box>
      <SearchFilters />
      <Divider sx={{ my: 1 }} />
      <PublicationGrid />
    </Box>
  );
};

export default PublicationMaster;
