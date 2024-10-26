import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { green, orange } from "@mui/material/colors";
import EditAddModal from "./EditAddModal";
import { useState } from "react";

const ClientMasterGrid = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen((prev) => !prev);
  const columns = [
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: () => (
        <IconButton color="primary" onClick={() => setOpen(true)}>
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

  const rows = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    clientId: `C${1000 + index}`,
    clientName: `Client ${index + 1}`,
    clientGroupId: `G${200 + index}`,
    isActive: index % 2 === 0 ? "Y" : "N",
  }));

  return (
    <>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          checkboxSelection
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
      <EditAddModal open={open} onClose={handleClose} openFromWhere="edit" />
    </>
  );
};

export default ClientMasterGrid;
