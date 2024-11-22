import { Box, Divider } from "@mui/material";
import SearchFilters from "../SearchFilters";
import { useState } from "react";
import PublicationGroupGrid from "./PublicationGroupGrid";
import PublicationGroupAddEditModal from "./PublicationGroupAddEditModal";

const PublicationGroupMaster = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [publicationData, setPublicationData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchAfterSave, setFetchAfterSave] = useState(false);

  // * endpoints
  let mainFetchAPI = "publicationGroupMaster";
  let mainDeleteAPI = "removePublicationGroup";
  return (
    <Box>
      <SearchFilters
        handleOpen={handleOpen}
        setData={setPublicationData}
        loading={loading}
        setLoading={setLoading}
        endpoint={mainFetchAPI}
        deleteEndPoint={mainDeleteAPI}
        selectedItems={selectedItems}
        fetchAfterSave={fetchAfterSave}
        setFetchAfterSave={setFetchAfterSave}
      />
      <Divider sx={{ my: 1 }} />
      <PublicationGroupGrid
        publicationData={publicationData}
        loading={loading}
        setSelectedItems={setSelectedItems}
        setFetchAfterSave={setFetchAfterSave}
      />
      <PublicationGroupAddEditModal
        fromWhere="Add"
        handleClose={handleClose}
        open={open}
        setFetchAfterSave={setFetchAfterSave}
      />
    </Box>
  );
};

export default PublicationGroupMaster;
