import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Fragment, useState } from "react";
import PublicationGroupAddEditModal from "./PublicationGroupAddEditModal";

const rows = [
  {
    id: 1,
    publicationgroupname: "Group A",
    publicationgroupid: "PG001",
    country: "USA",
    active: "Yes",
  },
  {
    id: 2,
    publicationgroupname: "Group B",
    publicationgroupid: "PG002",
    country: "Canada",
    active: "No",
  },
  {
    id: 3,
    publicationgroupname: "Group C",
    publicationgroupid: "PG003",
    country: "UK",
    active: "Yes",
  },
  {
    id: 4,
    publicationgroupname: "Group D",
    publicationgroupid: "PG004",
    country: "Australia",
    active: "No",
  },
  {
    id: 5,
    publicationgroupname: "Group E",
    publicationgroupid: "PG005",
    country: "India",
    active: "Yes",
  },
  {
    id: 6,
    publicationgroupname: "Group F",
    publicationgroupid: "PG006",
    country: "Germany",
    active: "No",
  },
  {
    id: 7,
    publicationgroupname: "Group G",
    publicationgroupid: "PG007",
    country: "France",
    active: "Yes",
  },
  {
    id: 8,
    publicationgroupname: "Group H",
    publicationgroupid: "PG008",
    country: "Japan",
    active: "No",
  },
  {
    id: 9,
    publicationgroupname: "Group I",
    publicationgroupid: "PG009",
    country: "Brazil",
    active: "Yes",
  },
  {
    id: 10,
    publicationgroupname: "Group J",
    publicationgroupid: "PG010",
    country: "South Africa",
    active: "No",
  },
];

const PublicationGroupGrid = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };
  const handleClose = () => {
    setSelectedRow(null);
    setOpen(false);
  };

  const columns = [
    {
      field: "editNote",
      headerName: "Edit Note",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <GridActionsCellItem
          icon={<EditNoteIcon />}
          label="Edit"
          sx={{ color: "primary.main" }}
          onClick={() => handleOpen(params.row)}
        />
      ),
    },
    {
      field: "publicationgroupname",
      headerName: "Publication Group Name",
      flex: 1,
    },
    {
      field: "publicationgroupid",
      headerName: "Publication Group ID",
      flex: 1,
    },
    {
      field: "country",
      headerName: "Country",
      flex: 1,
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      renderCell: (params) => (
        <span
          style={{
            color: params.value === "Yes" ? "green" : "orange",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </span>
      ),
    },
  ];

  return (
    <Fragment>
      <Box sx={{ height: "80vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          density="compact"
          checkboxSelection
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
        />
      </Box>
      <PublicationGroupAddEditModal
        open={open}
        handleClose={handleClose}
        row={selectedRow}
        fromWhere="Edit"
      />
    </Fragment>
  );
};

export default PublicationGroupGrid;
