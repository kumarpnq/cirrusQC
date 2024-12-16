import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { EditNote } from "@mui/icons-material";
import { Fragment, useState } from "react";
import OnlineAddModal from "./OnlineAddModal";

const OnlineGrid = ({
  loading,
  clusterData = [],
  selectedItems = [],
  setSelectedItems,
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleEditOpen = (row) => {
    setEditOpen((prev) => !prev);
    setSelectedRow(row);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };
  const columns = [
    {
      field: "_",
      headerName: "Edit",
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEditOpen(params.row)}>
          <EditNote />
        </IconButton>
      ),
    },
    { field: "clusterId", headerName: "Cluster ID", width: 150 },
    { field: "clusterName", headerName: "Cluster Name", width: 200 },
  ];
  const rows = clusterData.map((i) => ({
    id: i.clusterId,
    ...i,
  }));
  const handleRowSelection = (newSelection) => {
    setSelectedItems(newSelection);
  };
  return (
    <Fragment>
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
      <OnlineAddModal
        open={editOpen}
        handleClose={handleEditClose}
        row={selectedRow}
        fromWhere={"Edit"}
      />
    </Fragment>
  );
};

OnlineGrid.propTypes = {
  loading: PropTypes.bool.isRequired,
  clusterData: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
};
export default OnlineGrid;
