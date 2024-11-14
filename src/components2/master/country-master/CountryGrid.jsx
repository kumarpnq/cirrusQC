import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CustomToolbar } from "../../../@core/CustomGridToolExportAndFilter";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Fragment, useState } from "react";
import CountryAddEdit from "./CountryAddEdit";

const CountryGrid = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([
    {
      id: 1,
      countryName: "United States",
      active: true,
    },
    {
      id: 2,
      countryName: "India",
      active: false,
    },
    {
      id: 3,
      countryName: "United Kingdom",
      active: true,
    },
    {
      id: 4,
      countryName: "Germany",
      active: true,
    },
    {
      id: 5,
      countryName: "France",
      active: false,
    },
    {
      id: 6,
      countryName: "Japan",
      active: true,
    },
    {
      id: 7,
      countryName: "China",
      active: true,
    },
    {
      id: 8,
      countryName: "Russia",
      active: false,
    },
    {
      id: 9,
      countryName: "United Arab Emirates",
      active: true,
    },
    {
      id: 10,
      countryName: "Brazil",
      active: true,
    },
    {
      id: 11,
      countryName: "Mexico",
      active: false,
    },
    {
      id: 12,
      countryName: "Argentina",
      active: true,
    },
    {
      id: 13,
      countryName: "Canada",
      active: true,
    },
    {
      id: 14,
      countryName: "South Korea",
      active: false,
    },
    {
      id: 15,
      countryName: "Singapore",
      active: true,
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
    { field: "countryName", headerName: "Country Name", width: 150 },
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
      <CountryAddEdit open={open} handleClose={() => setOpen(false)} />
    </Fragment>
  );
};

export default CountryGrid;
