import { Box, Divider } from "@mui/material";
import SearchFilters from "../SearchFilters";
import { useState } from "react";
import StateGrid from "./StateGrid";
import StateEditModal from "./StateEditModal";

const StateMaster = () => {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <SearchFilters handleOpen={() => setOpen((prev) => !prev)} />
      <Divider sx={{ my: 1 }} />
      <StateGrid />
      <StateEditModal
        open={open}
        handleClose={() => setOpen((prev) => !prev)}
      />
    </Box>
  );
};

export default StateMaster;
