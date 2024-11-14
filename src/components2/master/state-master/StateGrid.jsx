import EditNoteIcon from "@mui/icons-material/EditNote";
import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CustomToolbar } from "../../../@core/CustomGridToolExportAndFilter";
import { Fragment, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import StateEditModal from "./StateEditModal";

const StateGrid = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([
    {
      id: 1,
      stateName: "New York",
      Zone: "New York",
      active: true,
    },
    {
      id: 2,
      stateName: "California",
      Zone: "California",
      active: false,
    },
    {
      id: 3,
      stateName: "Maharashtra",
      Zone: "Maharashtra",
      active: true,
    },
    {
      id: 4,
      stateName: "Illinois",
      Zone: "Illinois",
      active: true,
    },
    {
      id: 5,
      stateName: "Texas",
      Zone: "Texas",
      active: false,
    },
    {
      id: 6,
      stateName: "England",
      Zone: "England",
      active: true,
    },
    {
      id: 7,
      stateName: "Berlin",
      Zone: "Berlin",
      active: true,
    },
    {
      id: 8,
      stateName: "Île-de-France",
      Zone: "Île-de-France",
      active: false,
    },
    {
      id: 9,
      stateName: "Tokyo",
      Zone: "Tokyo",
      active: true,
    },
    {
      id: 10,
      stateName: "New South Wales",
      Zone: "New South Wales",
      active: true,
    },
    {
      id: 11,
      stateName: "Beijing",
      Zone: "Beijing",
      active: false,
    },
    {
      id: 12,
      stateName: "Moscow",
      Zone: "Moscow",
      active: true,
    },
    {
      id: 13,
      stateName: "Dubai",
      Zone: "Dubai",
      active: true,
    },
    {
      id: 14,
      stateName: "São Paulo",
      Zone: "São Paulo",
      active: false,
    },
    {
      id: 15,
      stateName: "Mexico City",
      Zone: "Mexico City",
      active: true,
    },
    {
      id: 16,
      stateName: "Buenos Aires",
      Zone: "Buenos Aires",
      active: true,
    },
    {
      id: 17,
      stateName: "Ontario",
      Zone: "Ontario",
      active: false,
    },
    {
      id: 18,
      stateName: "British Columbia",
      Zone: "British Columbia",
      active: true,
    },
    {
      id: 19,
      stateName: "Seoul",
      Zone: "Seoul",
      active: true,
    },
    {
      id: 20,
      stateName: "Central Region",
      Zone: "Central Region",
      active: true,
    },
    // Dummy records
    {
      id: 21,
      stateName: "Dummy State 1",
      Zone: "Dummy Zone 1",
      active: true,
    },
    {
      id: 22,
      stateName: "Dummy State 2",
      Zone: "Dummy Zone 2",
      active: false,
    },
    {
      id: 23,
      stateName: "Dummy State 3",
      Zone: "Dummy Zone 3",
      active: true,
    },
    {
      id: 24,
      stateName: "Dummy State 4",
      Zone: "Dummy Zone 4",
      active: false,
    },
  ]);

  const handleOpen = () => setOpen((prev) => !prev);

  const columns = [
    {
      field: "edit",
      headerName: "Edit",
      renderCell: () => (
        <IconButton color="primary" onClick={handleOpen}>
          <EditNoteIcon />
        </IconButton>
      ),
      width: 70,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: () => (
        <IconButton onClick={() => alert("Record deleted.")}>
          <DeleteIcon />
        </IconButton>
      ),
      width: 70,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "active",
      headerName: "Active",
      renderCell: (params) => (
        <Box
          sx={{
            color: params.row.active ? "green" : "orange",
            fontWeight: "bold",
          }}
        >
          {params.row.active ? "Yes" : "No"}
        </Box>
      ),
      width: 100,
    },
    { field: "stateName", headerName: "State Name", width: 150 },
    { field: "Zone", headerName: "Zone", width: 150 },
  ];

  return (
    <Fragment>
      <Box sx={{ height: "70vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          density="compact"
          slots={{
            toolbar: CustomToolbar,
          }}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
        />
      </Box>
      <StateEditModal open={open} handleClose={() => setOpen(false)} />
    </Fragment>
  );
};

export default StateGrid;
