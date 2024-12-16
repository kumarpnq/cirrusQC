import { EditNote } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import PrintAddModal from "./PrintAddModal";

const PrintGrid = ({
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
          loading={loading}
          density="compact"
          rowSelectionModel={selectedItems}
          onRowSelectionModelChange={handleRowSelection}
          hideFooterSelectedRowCount
          disableRowSelectionOnClick
        />
      </Box>
      <PrintAddModal
        open={editOpen}
        handleClose={handleEditClose}
        fromWhere="Edit"
        row={selectedRow}
      />
    </Fragment>
  );
};

PrintGrid.propTypes = {
  loading: PropTypes.bool.isRequired,
  clusterData: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
};
export default PrintGrid;
