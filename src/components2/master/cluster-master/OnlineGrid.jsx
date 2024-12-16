import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

const columns = [
  { field: "clusterId", headerName: "Cluster ID", width: 150 },
  { field: "clusterName", headerName: "Cluster Name", width: 200 },
];

const OnlineGrid = ({
  loading,
  clusterData = [],
  selectedItems = [],
  setSelectedItems,
}) => {
  const rows = clusterData.map((i) => ({
    id: i.clusterId,
    ...i,
  }));
  const handleRowSelection = (newSelection) => {
    setSelectedItems(newSelection);
  };
  return (
    <Box sx={{ height: "70vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        density="compact"
        loading={loading}
        rowSelectionModel={selectedItems}
        onRowSelectionModelChange={handleRowSelection}
        hideFooterSelectedRowCount
        disableRowSelectionOnClick
      />
    </Box>
  );
};

OnlineGrid.propTypes = {
  loading: PropTypes.bool.isRequired,
  clusterData: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
};
export default OnlineGrid;
