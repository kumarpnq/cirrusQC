import { Box, Divider } from "@mui/material";
import SearchFilters from "./SearchFilters";
import PrintGrid from "./PrintGrid";
import { useState } from "react";
import PrintAddModal from "./PrintAddModal";

const PrintCluster = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const handleEditOpen = () => setAddModalOpen(true);
  const handleEditClose = () => setAddModalOpen(false);
  return (
    <Box sx={{ mt: 0.5 }}>
      <SearchFilters handleOpen={handleEditOpen} />
      <Divider sx={{ my: 1 }} />
      <PrintGrid />
      <PrintAddModal open={addModalOpen} handleClose={handleEditClose} />
    </Box>
  );
};

export default PrintCluster;
