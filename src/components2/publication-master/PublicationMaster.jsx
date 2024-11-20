import { Box, Divider } from "@mui/material";
import SearchFilters from "./SearchFilters";
import PublicationGrid from "./PublicationGrid";
import { useState } from "react";

const PublicationMaster = () => {
  const [publicationData, setPublicationData] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  return (
    <Box>
      <SearchFilters
        fetchLoading={fetchLoading}
        setFetchLoading={setFetchLoading}
        setPublicationData={setPublicationData}
      />
      <Divider sx={{ my: 1 }} />
      <PublicationGrid
        fetchLoading={fetchLoading}
        publicationData={publicationData}
      />
    </Box>
  );
};

export default PublicationMaster;
