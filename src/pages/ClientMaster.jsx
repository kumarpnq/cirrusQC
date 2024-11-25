import { Box, Divider } from "@mui/material";
import SearchFilters from "../components2/client-master/SearchFilters";
import ClientMasterGrid from "../components2/client-master/ClientMasterGrid";
import { useState } from "react";

const ClientMaster = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <Box sx={{ px: 1 }}>
      <SearchFilters
        loading={loading}
        setLoading={setLoading}
        setData={setData}
      />
      <Divider sx={{ my: 1 }} />
      <ClientMasterGrid loading={loading} data={data} />
    </Box>
  );
};

export default ClientMaster;
