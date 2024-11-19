import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const MagazineStitchGrid = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      articleid: "A001",
      articledate: "2024-11-18",
      uploaddate: "2024-11-19",
      headline: "Headline 1",
      reportingSubject: "Subject 1",
      page: 12,
      size: "Full Page",
    },
    {
      id: 2,
      articleid: "A002",
      articledate: "2024-11-17",
      uploaddate: "2024-11-18",
      headline: "Headline 2",
      reportingSubject: "Subject 2",
      page: 5,
      size: "Half Page",
    },
    {
      id: 3,
      articleid: "A003",
      articledate: "2024-11-16",
      uploaddate: "2024-11-17",
      headline: "Headline 3",
      reportingSubject: "Subject 3",
      page: 8,
      size: "Quarter Page",
    },
    // Add more rows as needed
  ]);

  // Define the columns
  const columns = [
    { field: "articleid", headerName: "Article ID", width: 150 },
    {
      field: "articledate",
      headerName: "Article Date",
      width: 150,
    },
    {
      field: "uploaddate",
      headerName: "Upload Date",
      width: 150,
    },
    { field: "headline", headerName: "Headline", width: 250 },
    { field: "reportingSubject", headerName: "Reporting Subject", width: 200 },
    { field: "page", headerName: "Page", width: 100 },
    { field: "size", headerName: "Size", width: 150 },
  ];

  return (
    <Box sx={{ height: "80vh", width: "100%", mt: 1 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        density="compact"
        disableRowSelectionOnClick
        hideFooterSelectedRowCount
      />
    </Box>
  );
};

export default MagazineStitchGrid;
