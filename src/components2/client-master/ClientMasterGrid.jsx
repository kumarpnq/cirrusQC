import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { green, orange } from "@mui/material/colors";
import EditAddModal from "./EditAddModal";
import { useState } from "react";
import PropTypes from "prop-types";

const ClientMasterGrid = ({ data = [], loading }) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpen = (row) => {
    setOpen(true);
    setSelectedRow(row);
  };
  const handleClose = () => {
    setOpen((prev) => !prev);
    setSelectedRow(null);
  };

  const columns = [
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleOpen(params.row)}>
          <EditNoteIcon
            style={{ cursor: "pointer", marginRight: 10 }}
            className="text-primary"
          />
        </IconButton>
      ),
      sortable: false,
      filterable: false,
    },
    { field: "clientId", headerName: "Client ID", width: 150 },
    { field: "clientName", headerName: "Client Name", width: 200 },
    { field: "clientGroupId", headerName: "Client Group ID", width: 150 },
    {
      field: "isActive",
      headerName: "Is Active",
      width: 130,
      renderCell: (params) => (
        <Box
          sx={{
            color: params.value === "Y" ? green[500] : orange[500],
            fontWeight: "bold",
          }}
        >
          {params.value}
        </Box>
      ),
    },
  ];

  const rows = data.map((item, index) => ({
    id: index,
    ...item,
  }));

  return (
    <>
      <Box sx={{ height: "80vh  ", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          checkboxSelection
          loading={loading}
          density="compact"
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
      <EditAddModal
        open={open}
        onClose={handleClose}
        openFromWhere="edit"
        row={selectedRow}
      />
    </>
  );
};

ClientMasterGrid.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      clientId: PropTypes.string.isRequired,
      clientName: PropTypes.string.isRequired,
      clientGroupId: PropTypes.string.isRequired,
      isActive: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ClientMasterGrid;
