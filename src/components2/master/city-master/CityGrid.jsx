import { Fragment, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddEditModal from "./AddEditModal";

const CustomToolbar = () => {
  return (
    <GridToolbarContainer
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <GridToolbarExport />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
};

const CityGrid = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [rows, setRows] = useState([
    {
      id: 1,
      cityName: "New York",
      stateName: "New York",
      countryName: "USA",
      active: true,
    },
    {
      id: 2,
      cityName: "Los Angeles",
      stateName: "California",
      countryName: "USA",
      active: false,
    },
    {
      id: 3,
      cityName: "Mumbai",
      stateName: "Maharashtra",
      countryName: "India",
      active: true,
    },
    {
      id: 4,
      cityName: "Chicago",
      stateName: "Illinois",
      countryName: "USA",
      active: true,
    },
    {
      id: 5,
      cityName: "Houston",
      stateName: "Texas",
      countryName: "USA",
      active: false,
    },
    {
      id: 6,
      cityName: "London",
      stateName: "England",
      countryName: "UK",
      active: true,
    },
    {
      id: 7,
      cityName: "Berlin",
      stateName: "Berlin",
      countryName: "Germany",
      active: true,
    },
    {
      id: 8,
      cityName: "Paris",
      stateName: "Île-de-France",
      countryName: "France",
      active: false,
    },
    {
      id: 9,
      cityName: "Tokyo",
      stateName: "Tokyo",
      countryName: "Japan",
      active: true,
    },
    {
      id: 10,
      cityName: "Sydney",
      stateName: "New South Wales",
      countryName: "Australia",
      active: true,
    },
    {
      id: 11,
      cityName: "Beijing",
      stateName: "Beijing",
      countryName: "China",
      active: false,
    },
    {
      id: 12,
      cityName: "Moscow",
      stateName: "Moscow",
      countryName: "Russia",
      active: true,
    },
    {
      id: 13,
      cityName: "Dubai",
      stateName: "Dubai",
      countryName: "UAE",
      active: true,
    },
    {
      id: 14,
      cityName: "São Paulo",
      stateName: "São Paulo",
      countryName: "Brazil",
      active: false,
    },
    {
      id: 15,
      cityName: "Mexico City",
      stateName: "Mexico City",
      countryName: "Mexico",
      active: true,
    },
    {
      id: 16,
      cityName: "Buenos Aires",
      stateName: "Buenos Aires",
      countryName: "Argentina",
      active: true,
    },
    {
      id: 17,
      cityName: "Toronto",
      stateName: "Ontario",
      countryName: "Canada",
      active: false,
    },
    {
      id: 18,
      cityName: "Vancouver",
      stateName: "British Columbia",
      countryName: "Canada",
      active: true,
    },
    {
      id: 19,
      cityName: "Seoul",
      stateName: "Seoul",
      countryName: "South Korea",
      active: true,
    },
    {
      id: 20,
      cityName: "Singapore",
      stateName: "Central Region",
      countryName: "Singapore",
      active: true,
    },
  ]);

  const columns = [
    {
      field: "edit",
      headerName: "Edit",
      renderCell: () => (
        <IconButton color="primary" onClick={handleOpen}>
          <EditIcon />
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
    { field: "cityName", headerName: "City Name", width: 150 },
    { field: "stateName", headerName: "State Name", width: 150 },
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
      <AddEditModal open={open} handleClose={handleClose} />
    </Fragment>
  );
};

export default CityGrid;
