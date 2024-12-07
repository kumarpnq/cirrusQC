import { Box, Divider } from "@mui/material";
import SearchFilters from "./SearchFilters";
import OnlineGrid from "./OnlineGrid";
import { useState } from "react";
import OnlineAddModal from "./OnlineAddModal";

const OnlineCluster = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const handleEditOpen = () => setAddModalOpen(true);
  const handleEditClose = () => setAddModalOpen(false);
  return (
    <Box sx={{ mt: 0.5 }}>
      <SearchFilters handleOpen={handleEditOpen} />
      <Divider sx={{ my: 1 }} />
      <OnlineGrid />
      <OnlineAddModal open={addModalOpen} handleClose={handleEditClose} />
    </Box>
  );
};

export default OnlineCluster;
