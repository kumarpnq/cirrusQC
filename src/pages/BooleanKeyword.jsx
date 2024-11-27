import { Box, Divider } from "@mui/material";
import SearchFilters from "../components2/BooleanKeyword/SearchFilters";
import BooleanGrid from "../components2/BooleanKeyword/BooleanGrid";
import { useState } from "react";

const BooleanKeyword = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  return (
    <Box sx={{ px: 2 }}>
      <SearchFilters
        loading={loading}
        setLoading={setLoading}
        setData={setData}
      />
      <Divider sx={{ my: 1 }} />
      <BooleanGrid data={data} loading={loading} setData={setData} />
    </Box>
  );
};

export default BooleanKeyword;
