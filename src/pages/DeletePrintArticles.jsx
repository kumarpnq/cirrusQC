import { Box, Divider } from "@mui/material";
import SearchFilters from "../components2/delete-print-articles/SearchFilters";
import DeleteGrid from "../components2/delete-print-articles/DeleteGrid";
import { useState } from "react";

const DeletePrintArticles = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  return (
    <Box sx={{ px: 1 }}>
      <SearchFilters
        setData={setData}
        loading={loading}
        setLoading={setLoading}
      />
      <Divider sx={{ my: 1 }} />
      <DeleteGrid data={data} loading={loading} setData={setData} />
    </Box>
  );
};

export default DeletePrintArticles;
