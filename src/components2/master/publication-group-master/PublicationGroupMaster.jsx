import { Box, Divider } from "@mui/material";
import SearchFilters from "../SearchFilters";
import { useState } from "react";
import PublicationGroupGrid from "./PublicationGroupGrid";
import PublicationGroupAddEditModal from "./PublicationGroupAddEditModal";

const PublicationGroupMaster = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Box>
      <SearchFilters handleOpen={handleOpen} />
      <Divider sx={{ my: 1 }} />
      <PublicationGroupGrid />
      <PublicationGroupAddEditModal
        fromWhere="Add"
        handleClose={handleClose}
        open={open}
      />
    </Box>
  );
};

export default PublicationGroupMaster;
