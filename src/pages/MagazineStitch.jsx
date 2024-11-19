import { Box, Divider } from "@mui/material";
import SearchFilters from "../components2/magazine-stitch/SearchFilters";
import MagazineStitchGrid from "../components2/magazine-stitch/MagazineStitchGrid";

const MagazineStitch = () => {
  return (
    <Box sx={{ px: 1 }}>
      <SearchFilters />
      <Divider sx={{ mt: 1 }} />
      <MagazineStitchGrid />
    </Box>
  );
};

export default MagazineStitch;
