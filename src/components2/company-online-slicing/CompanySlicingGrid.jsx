import { Box, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import PublicationViewModal from "./PublicationView";
import CompanySlicingModal from "./CompanySlicingEdit";
import PublicationPrintView from "./PublicationPrintView";
import PropTypes from "prop-types";
import CompanySlicingPrintModal from "./CompanySlicingPrintModal";

const CompanySlicingGrid = ({ activeTab }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleClose = () => setOpen((prev) => !prev);
  const handleCloseEdit = () => setOpenEdit((prev) => !prev);

  const rows = [
    {
      id: 1,
      sourceCompany: "Apple Inc.",
      destinationCompany: "Samsung",
      publicationView: "1000 views",
    },
    {
      id: 2,
      sourceCompany: "Google LLC",
      destinationCompany: "Microsoft",
      publicationView: "850 views",
    },
    {
      id: 3,
      sourceCompany: "Amazon",
      destinationCompany: "eBay",
      publicationView: "1200 views",
    },
    {
      id: 4,
      sourceCompany: "Tesla",
      destinationCompany: "Ford",
      publicationView: "750 views",
    },
    {
      id: 5,
      sourceCompany: "Meta Platforms",
      destinationCompany: "Twitter",
      publicationView: "950 views",
    },
  ];
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => setOpenEdit((prev) => !prev)}>
            <EditNoteIcon
              style={{ cursor: "pointer", marginRight: 10 }}
              className="text-primary"
            />
          </IconButton>

          <IconButton
            onClick={() => {
              alert(params.value);
            }}
          >
            <DeleteIcon
              style={{ cursor: "pointer" }}
              className="text-primary"
            />
          </IconButton>
        </>
      ),
    },

    {
      field: "sourceCompany",
      headerName: "Source Company",
      width: 150,
    },
    {
      field: "destinationCompany",
      headerName: "Destination Company",
      width: 150,
    },
    {
      field: "config",
      headerName: "Config",
      width: 150,
      renderCell: (params) => (
        <IconButton onClick={() => setOpen((prev) => !prev)}>
          <VisibilityIcon
            style={{ cursor: "pointer" }}
            titleAccess={params.value}
            className="text-primary"
          />
        </IconButton>
      ),
    },
  ];
  return (
    <>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          density="standard"
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
      {!activeTab ? (
        <>
          <PublicationViewModal open={open} handleClose={handleClose} />
          <CompanySlicingModal open={openEdit} handleClose={handleCloseEdit} />
        </>
      ) : (
        <>
          <PublicationPrintView open={open} handleClose={handleClose} />
          <CompanySlicingPrintModal
            open={openEdit}
            handleClose={handleCloseEdit}
          />
        </>
      )}
    </>
  );
};

CompanySlicingGrid.propTypes = {
  activeTab: PropTypes.number.isRequired,
};

export default CompanySlicingGrid;
