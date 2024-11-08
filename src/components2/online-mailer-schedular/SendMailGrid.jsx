import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const columns = [
  { field: "articleId", headerName: "Article ID", width: 150 },
  { field: "articleDate", headerName: "Article Date", width: 180 },
  { field: "publicationName", headerName: "Publication Name", width: 200 },
  { field: "headline", headerName: "Headline", width: 300 },
  { field: "pageNumber", headerName: "Page Number", width: 120 },
  { field: "pdfSize", headerName: "PDF Size", width: 120 },
  { field: "reportingSubject", headerName: "Reporting Subject", width: 200 },
];

const rows = [];

const SendMailGrid = () => {
  return (
    <Box sx={{ height: 550, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        density="compact"
        rowsPerPageOptions={[5]}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
      />
    </Box>
  );
};

export default SendMailGrid;
