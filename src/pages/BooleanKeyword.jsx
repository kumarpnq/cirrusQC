import { Box, Divider } from "@mui/material";
import SearchFilters from "../components2/BooleanKeyword/SearchFilters";
import BooleanGrid from "../components2/BooleanKeyword/BooleanGrid";

const BooleanKeyword = () => {
  return (
    <Box sx={{ px: 2 }}>
      <SearchFilters />
      <Divider sx={{ my: 1 }} />
      <BooleanGrid />
    </Box>
  );
};

export default BooleanKeyword;
