import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const columns = [
  { field: "clusterId", headerName: "Cluster ID", width: 150 },
  { field: "clusterName", headerName: "Cluster Name", width: 200 },
];

const rows = [
  { id: 1, clusterId: "123", clusterName: "Cluster A" },
  { id: 2, clusterId: "124", clusterName: "Cluster B" },
  { id: 3, clusterId: "125", clusterName: "Cluster C" },
  // Add more rows as needed
];

const OnlineGrid = () => {
  return (
    <Box sx={{ height: "70vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        density="compact"
        hideFooterSelectedRowCount
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default OnlineGrid;
