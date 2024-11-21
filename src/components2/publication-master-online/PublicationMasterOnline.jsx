import { Box, Divider } from "@mui/material";
import SearchFilters from "../publication-master/SearchFilters";
import { useState } from "react";
import PublicationGrid from "../publication-master/PublicationGrid";

const PublicationMasterOnline = () => {
  const [fetchLoading, setFetchLoading] = useState(false);
  const [publicationData, setPublicationData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionModal, setSelectionModal] = useState([]);

  // * endpoints
  let mainFetchApi = "publicationMasterOnline";
  let mainDeleteApi = "removeOnlinePublication";
  // * screen type
  let screen = "online";
  return (
    <Box>
      <SearchFilters
        fetchLoading={fetchLoading}
        setFetchLoading={setFetchLoading}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setPublicationData={setPublicationData}
        setSelectionModal={setSelectionModal}
        mainDeleteApi={mainDeleteApi}
        mainFetchAPi={mainFetchApi}
      />

      <Divider sx={{ my: 1 }} />

      <PublicationGrid
        fetchLoading={fetchLoading}
        selectionModal={selectionModal}
        setSelectedItems={setSelectedItems}
        setSelectionModal={setSelectionModal}
        publicationData={publicationData}
        screen={screen}
      />
    </Box>
  );
};

export default PublicationMasterOnline;
