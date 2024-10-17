import PropTypes from "prop-types";
import { Box, IconButton } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { GridToolbar, DataGrid as MUIDataGrid } from "@mui/x-data-grid";
import { Fragment, useState } from "react";
import CompanyFormModal from "./EditModal";

const DataGrid = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [rowId, setRowId] = useState(null);

  const handleOpen = (rowId) => {
    setRowId(rowId);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const columns = [
    {
      field: "_",
      headerName: "Edit",
      width: 60,
      renderCell: (params) => (
        <IconButton onClick={() => handleOpen(params.row?.id)}>
          <EditNoteIcon className="text-primary" />
        </IconButton>
      ),
    },
    { field: "companyId", headerName: "Company ID", width: 130 },
    { field: "companyName", headerName: "Company Name", width: 200 },
    { field: "parentCompany", headerName: "Parent Company", width: 200 },
    { field: "industry", headerName: "Industry", width: 150 },
    { field: "shortCompany", headerName: "Short Company", width: 150 },
    { field: "isActive", headerName: "Active", width: 100 },
  ];

  return (
    <Fragment>
      <Box sx={{ height: 500, width: "100%" }}>
        <MUIDataGrid
          rows={data}
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
        />
      </Box>
      <CompanyFormModal open={open} handleClose={handleClose} rowId={rowId} />
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
    })
  ).isRequired,
};

export default DataGrid;
