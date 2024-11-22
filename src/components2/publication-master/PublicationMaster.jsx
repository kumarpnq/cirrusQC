import { Box, Divider } from "@mui/material";
import SearchFilters from "./SearchFilters";
import PublicationGrid from "./PublicationGrid";
import { useState } from "react";

const PublicationMaster = () => {
  const [publicationData, setPublicationData] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionModal, setSelectionModal] = useState([]);

  // * endpoints
  let mainFetchApi = "publicationMaster";
  let mainDeleteApi = "removePublication";

  // * screen type
  let screen = "print";
  return (
    <Box>
      <SearchFilters
        fetchLoading={fetchLoading}
        setFetchLoading={setFetchLoading}
        setPublicationData={setPublicationData}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setSelectionModal={setSelectionModal}
        mainFetchAPi={mainFetchApi}
        mainDeleteApi={mainDeleteApi}
        screen={screen}
      />
      <Divider sx={{ my: 1 }} />
      <PublicationGrid
        fetchLoading={fetchLoading}
        publicationData={publicationData}
        setSelectedItems={setSelectedItems}
        selectionModal={selectionModal}
        setSelectionModal={setSelectionModal}
        screen={screen}
      />
    </Box>
  );
};

export default PublicationMaster;
