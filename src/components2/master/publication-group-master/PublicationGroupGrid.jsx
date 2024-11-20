import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";

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
  // Add more rows as needed
];

const PublicationGroupGrid = () => {
  const handleEdit = (id) => {
    console.log(`Edit note for row with id: ${id}`);
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
          onClick={() => handleEdit(params.id)}
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
  );
};

export default PublicationGroupGrid;
