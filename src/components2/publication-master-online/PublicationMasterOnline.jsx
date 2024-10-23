import { Box, Divider } from "@mui/material";
import SearchFilters from "./SearchFilters";
import PublicationOnlineGrid from "./PublicationOnlineGrid";

const PublicationMasterOnline = () => {
  return (
    <Box>
      <SearchFilters />
      <Divider sx={{ my: 1 }} />
      <PublicationOnlineGrid />
    </Box>
  );
};

export default PublicationMasterOnline;
