import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

const BulkTable = ({
  data,
  setSelectedRows,
  selectionModal,
  setSelectionModal,
}) => {
  const returnColor = (value) => {
    switch (value) {
      case "Article Not Uploaded.":
        return "red";
      case "Article Already Exist.":
        return "green";
      case "Pending Check":
        return "orange";
      default:
        return "gray";
    }
  };

  const columns = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "company", headerName: "Company", width: 200, editable: true },
    { field: "socialfeedid", headerName: "Social Feed ID", width: 140 },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        const color = returnColor(params.row.status);
        return (
          <Box
            sx={{
              color: color,
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
    status: item.status,
  }));

  const handleRowSelection = (newSelectionModel) => {
    setSelectionModal(newSelectionModel);

    const selectedRowData = newSelectionModel.map((id) => rowDataMap[id]);
    setSelectedRows(selectedRowData);
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
