import { Box, Divider } from "@mui/material";
import { useState } from "react";

import CityGrid from "./CityGrid";
import AddEditModal from "./AddEditModal";
import SearchFilters from "../SearchFilters";

const CityMaster = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  return (
    <Box>
      {/* search filters */}
      <SearchFilters handleOpen={() => setOpen((prev) => !prev)} />
      <Divider sx={{ my: 1 }} />
      <CityGrid />
      <AddEditModal open={open} handleClose={handleClose} />
    </Box>
  );
};

export default CityMaster;
