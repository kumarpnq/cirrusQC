import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles"; // If you're using JSS for styling

// Create custom styles for row colors
const useStyles = makeStyles({
  DUP: {
    backgroundColor: "rgb(255, 255, 153) !important",
  },
  UP: {
    backgroundColor: "rgb(204, 229, 255) !important",
  },
  SE: {
    backgroundColor: "rgb(255, 229, 204) !important",
  },
  IC: {
    backgroundColor: "rgb(255, 204, 204) !important",
  },
  US: {
    backgroundColor: "rgb(204, 255, 204) !important",
  },
  P: {
    backgroundColor: "#8B8000 !important",
  },
  NU: {
    backgroundColor: "red !important",
  },
  default: {
    backgroundColor: "gray !important",
  },
});

const BulkTable = ({
  data,
  setSelectedRows,
  selectionModal,
  setSelectionModal,
}) => {
  const classes = useStyles();

  const columns = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "company", headerName: "Company ID", width: 200, editable: true },
    { field: "socialfeedid", headerName: "Social Feed ID", width: 140 },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              color: "black",
              fontWeight: "bold",
              borderRadius: "4px",
              padding: "4px",
            }}
          >
            {params.row.status}
          </Box>
        );
      },
    },
    { field: "link", headerName: "Link", width: 400 },
    { field: "headline", headerName: "Headline", width: 200 },
    { field: "summary", headerName: "Summary", width: 250 },
    { field: "language", headerName: "Language", width: 100 },
  ];

  const rowDataMap = data.reduce((map, item, index) => {
    map[index] = item;
    return map;
  }, {});

  const rows = data.map((item, index) => ({
    id: index,
    socialfeedid: item.SocialFeedId,
    date: item.Date,
    company: item.CompanyID,
    link: item.Link,
    status: item.status || "Pending",
    headline: item.Headline,
    summary: item.Summary,
    language: item.Language,
    statusFlag: item.statusFlag || "P",
  }));

  const handleRowSelection = (newSelectionModel) => {
    setSelectionModal(newSelectionModel);

    const selectedRowData = newSelectionModel.map((id) => rowDataMap[id]);
    setSelectedRows(selectedRowData);
  };

  // Function to assign classes based on the statusFlag
  const getRowClassName = (params) => {
    return classes[params.row.statusFlag] || classes.default;
  };

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        rowSelectionModel={selectionModal}
        onRowSelectionModelChange={handleRowSelection}
        rowsPerPageOptions={[5, 10, 20]}
        slots={{ toolbar: GridToolbar }}
        density="standard"
        slotProps={{ toolbar: { showQuickFilter: true } }}
        disableDensitySelector
        disableColumnFilter
        disableColumnSelector
        disableRowSelectionOnClick
        disableSelectionOnClick
        getRowClassName={getRowClassName} // Apply row class based on the statusFlag
      />
    </Box>
  );
};

BulkTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  setSelectedRows: PropTypes.func.isRequired,
  selectionModal: PropTypes.array,
  setSelectionModal: PropTypes.func,
};

export default BulkTable;
