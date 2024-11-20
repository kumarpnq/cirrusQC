import { Box, Divider } from "@mui/material";
import SearchFilters from "../SearchFilters";
import { useState } from "react";
import PublicationGroupGrid from "./PublicationGroupGrid";

const PublicationGroupMaster = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  return (
    <Box>
      <SearchFilters handleOpen={handleOpen} />
      <Divider sx={{ my: 1 }} />
      <PublicationGroupGrid />
    </Box>
  );
};

export default PublicationGroupMaster;
