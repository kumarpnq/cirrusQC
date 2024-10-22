import { Box, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import WhatsAppEditModal from "./WhatsAppEditModal";

const WhatsAppContactGrid = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen((prev) => !prev);
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => setOpen((prev) => !prev)}>
            <EditNoteIcon
              style={{ cursor: "pointer", marginRight: 10 }}
              className="text-primary"
            />
          </IconButton>
          <IconButton>
            <DeleteIcon
              style={{ cursor: "pointer" }}
              className="text-primary"
            />
          </IconButton>
        </>
      ),
    },
    {
      field: "active",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: params.value === "Yes" ? "green" : "orange" }}>
          {params.value}
        </span>
      ),
    },
    { field: "client", headerName: "Client", width: 200 },
    { field: "contact", headerName: "Contact", width: 200 },
  ];

  const rows = [
    {
      id: 1,
      action: "",
      active: "Yes",
      client: "Client A",
      contact: "123-456-7890",
    },
    {
      id: 2,
      action: "",
      active: "No",
      client: "Client B",
      contact: "098-765-4321",
    },
    {
      id: 3,
      action: "",
      active: "Yes",
      client: "Client C",
      contact: "555-555-5555",
    },
    {
      id: 4,
      action: "",
      active: "No",
      client: "Client D",
      contact: "444-444-4444",
    },
    {
      id: 5,
      action: "",
      active: "Yes",
      client: "Client E",
      contact: "111-111-1111",
    },
    {
      id: 6,
      action: "",
      active: "No",
      client: "Client F",
      contact: "222-222-2222",
    },
    {
      id: 7,
      action: "",
      active: "Yes",
      client: "Client G",
      contact: "333-333-3333",
    },
    {
      id: 8,
      action: "",
      active: "No",
      client: "Client H",
      contact: "444-555-6666",
    },
    {
      id: 9,
      action: "",
      active: "Yes",
      client: "Client I",
      contact: "777-888-9999",
    },
    {
      id: 10,
      action: "",
      active: "No",
      client: "Client J",
      contact: "123-789-4561",
    },
    {
      id: 11,
      action: "",
      active: "Yes",
      client: "Client K",
      contact: "456-123-7890",
    },
    {
      id: 12,
      action: "",
      active: "No",
      client: "Client L",
      contact: "789-456-1230",
    },
    {
      id: 13,
      action: "",
      active: "Yes",
      client: "Client M",
      contact: "321-654-9870",
    },
    {
      id: 14,
      action: "",
      active: "No",
      client: "Client N",
      contact: "654-321-0987",
    },
    {
      id: 15,
      action: "",
      active: "Yes",
      client: "Client O",
      contact: "987-654-3210",
    },
    {
      id: 16,
      action: "",
      active: "No",
      client: "Client P",
      contact: "159-753-4862",
    },
    {
      id: 17,
      action: "",
      active: "Yes",
      client: "Client Q",
      contact: "258-852-3691",
    },
    {
      id: 18,
      action: "",
      active: "No",
      client: "Client R",
      contact: "369-741-8520",
    },
    {
      id: 19,
      action: "",
      active: "Yes",
      client: "Client S",
      contact: "741-963-2580",
    },
    {
      id: 20,
      action: "",
      active: "No",
      client: "Client T",
      contact: "852-147-9630",
    },
  ];

  return (
    <>
      <Box sx={{ height: 550, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
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
      <WhatsAppEditModal
        open={open}
        handleClose={handleClose}
        openedFromWhere="edit"
      />
    </>
  );
};

export default WhatsAppContactGrid;
