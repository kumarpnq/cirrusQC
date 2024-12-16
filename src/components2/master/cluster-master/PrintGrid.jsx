import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

const columns = [
  { field: "clusterId", headerName: "Cluster ID", width: 150 },
  { field: "clusterName", headerName: "Cluster Name", width: 200 },
];

const PrintGrid = ({ loading, clusterData = [] }) => {
  const rows = clusterData.map((i, index) => ({
    id: index,
    ...i,
  }));
  return (
    <Box sx={{ height: "70vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        loading={loading}
        density="compact"
        hideFooterSelectedRowCount
        disableRowSelectionOnClick
      />
    </Box>
  );
};

PrintGrid.propTypes = {
  loading: PropTypes.bool.isRequired,
  clusterData: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default PrintGrid;
