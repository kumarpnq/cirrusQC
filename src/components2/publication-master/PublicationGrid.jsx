import PropTypes from "prop-types";
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Fragment, useState } from "react";
import AddModal from "./AddModal";

const PublicationGrid = ({
  publicationData = [],
  fetchLoading,
  setSelectedItems,
  selectionModal,
  setSelectionModal,
  screen,
}) => {
  const [open, setOpen] = useState(false);
  const [rowId, setRowId] = useState(null);

  const handleOpen = (rowId) => {
    setRowId(rowId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRowId(null);
  };
  const handleSelectionChange = (newSelectionIds) => {
    const selectedRows = publicationData.filter((row, index) =>
      newSelectionIds.includes(index)
    );

    setSelectedItems(selectedRows);
    setSelectionModal(newSelectionIds);
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
    {
      field: "publicationId",
      headerName: "Publication ID",
      width: screen === "print" ? 150 : 300,
    },
    { field: "publicationName", headerName: "Publication Name", width: 200 },
    {
      field: "publicationGroupId",
      headerName: "Publication Group ID",
      width: 180,
    },
    { field: "publicationScore", headerName: "Publication Score", width: 180 },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        <span
          style={{
            fontWeight: "bold",
            color: params?.value === "Y" ? "green" : "orange",
          }}
        >
          {params?.value === "Y" ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  const rows = publicationData.map((publication, index) => ({
    id: index,
    publicationId: publication.publicationId,
    publicationName: publication.publicationName,
    publicationGroupId: publication.publicationGroupId,
    publicationScore: publication.publicationScore,
    isActive: publication.isActive,
  }));

  return (
    <Fragment>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          density="compact"
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          loading={fetchLoading}
          rowSelectionModel={selectionModal}
          onRowSelectionModelChange={handleSelectionChange}
          columnVisibilityModel={{
            publicationGroupId: screen === "print",
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
        />
      </Box>
      <AddModal
        open={open}
        handleClose={handleClose}
        row={rowId}
        screen={screen}
      />
    </Fragment>
  );
};

PublicationGrid.propTypes = {
  publicationData: PropTypes.array.isRequired,
  fetchLoading: PropTypes.bool.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  selectionModal: PropTypes.bool.isRequired,
  setSelectionModal: PropTypes.func.isRequired,
  screen: PropTypes.string,
};

export default PublicationGrid;
