import PropTypes from "prop-types";
import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Fragment, useState } from "react";
import AddModal from "./AddModal";

const PublicationGrid = ({ publicationData = [], fetchLoading }) => {
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
    { field: "publicationId", headerName: "Publication ID", width: 150 },
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
        />
      </Box>
      <AddModal open={open} handleClose={handleClose} row={rowId} />
    </Fragment>
  );
};

PublicationGrid.propTypes = {
  publicationData: PropTypes.array.isRequired,
  fetchLoading: PropTypes.bool.isRequired,
};
export default PublicationGrid;
