import { Box, Divider } from "@mui/material";
import SearchFilters from "../SearchFilters";
import { useState } from "react";
import CountryGrid from "./CountryGrid";
import CountryAddEdit from "./CountryAddEdit";

const CountryMaster = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((prev) => !prev);
  return (
    <Box>
      <SearchFilters handleOpen={handleOpen} />
      <Divider sx={{ my: 1 }} />
      <CountryGrid />
      <CountryAddEdit open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
};

export default CountryMaster;
