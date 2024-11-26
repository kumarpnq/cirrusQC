import PropTypes from "prop-types";
import { Box, IconButton } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { GridToolbar, DataGrid as MUIDataGrid } from "@mui/x-data-grid";
import { Fragment, useState } from "react";
import CompanyFormModal from "./EditModal";

const DataGrid = ({ data, setSelectedRows }) => {
  const [open, setOpen] = useState(false);
  const [rowId, setRowId] = useState(null);

  const handleOpen = (rowId) => {
    setRowId(rowId);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleRowSelectionChange = (selectedRowIds) => {
    const selectedData = selectedRowIds.map((id) =>
      rows.find((row) => row.id === id)
    );
    setSelectedRows(selectedData);
  };

  const columns = [
    {
      field: "_",
      headerName: "Edit",
      width: 60,
      renderCell: (params) => (
        <IconButton onClick={() => handleOpen(params.row)}>
          <EditNoteIcon className="text-primary" />
        </IconButton>
      ),
    },
    { field: "companyId", headerName: "Company ID", width: 130 },
    { field: "companyName", headerName: "Company Name", width: 200 },
    { field: "parentCompany", headerName: "Parent Company", width: 200 },
    { field: "industry", headerName: "Industry", width: 150 },
    { field: "shortCompany", headerName: "Short Company", width: 150 },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        <span
          style={{ color: params.row.isActive === "Y" ? "green" : "orange" }}
        >
          {params.row.isActive}
        </span>
      ),
    },
    { field: "country", headerName: "Country", width: 100 },
  ];

  const rows = data.map((item, index) => ({
    id: index,
    companyId: item.companyId,
    companyName: item.companyName,
    parentCompany: item.parentCompany,
    industry: item.industry,
    shortCompany: item.shortCompany,
    isActive: item.isActive,
    country: item.country,
    countryId: item.countryId,
    hasSubcategory: item.hasSubcategory,
  }));
  return (
    <Fragment>
      <Box sx={{ height: "75vh", width: "100%" }}>
        <MUIDataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          density="compact"
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          hideFooterSelectedRowCount
          onRowSelectionModelChange={(newSelection) =>
            handleRowSelectionChange(newSelection)
          }
        />
      </Box>
      <CompanyFormModal
        open={open}
        handleClose={handleClose}
        rowId={rowId}
        isEdit
      />
    </Fragment>
  );
};

DataGrid.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      companyId: PropTypes.string.isRequired,
      companyName: PropTypes.string.isRequired,
      parentCompany: PropTypes.string.isRequired,
      industry: PropTypes.string.isRequired,
      shortCompany: PropTypes.string.isRequired,
      isActive: PropTypes.string.isRequired,
      setSelectedRows: PropTypes.func.isRequired,
    })
  ).isRequired,
};

export default DataGrid;
