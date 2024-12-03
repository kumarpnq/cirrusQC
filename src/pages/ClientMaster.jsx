import { Box, Divider } from "@mui/material";
import SearchFilters from "../components2/client-master/SearchFilters";
import ClientMasterGrid from "../components2/client-master/ClientMasterGrid";
import { useState } from "react";

const ClientMaster = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectionModal, setSelectionModal] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <Box sx={{ px: 1 }}>
      <SearchFilters
        loading={loading}
        setLoading={setLoading}
        setData={setData}
        setSelectionModal={setSelectionModal}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      <Divider sx={{ my: 1 }} />
      <ClientMasterGrid
        loading={loading}
        data={data}
        setSelectionModal={setSelectionModal}
        selectionModal={selectionModal}
        setSelectedItems={setSelectedItems}
      />
    </Box>
  );
};

export default ClientMaster;
