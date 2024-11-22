import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Fragment, useState } from "react";
import PublicationGroupAddEditModal from "./PublicationGroupAddEditModal";

const PublicationGroupGrid = ({
  publicationData = [],
  loading,
  setSelectedItems,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectionModal, setSelectionModal] = useState([]);
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
      field: "pubGroupId",
      headerName: "Group ID",
    },
    {
      field: "pubGroupName",
      headerName: "Group Name",
      width: 300,
    },

    {
      field: "countryName",
      headerName: "Country",
      width: 200,
    },
    {
      field: "isActive",
      headerName: "Active",

      renderCell: (params) => (
        <span
          style={{
            color: params.value === "Y" ? "green" : "orange",
            fontWeight: "bold",
          }}
        >
          {params.value === "Y" ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  const rows = publicationData.map((item, index) => ({
    id: index,
    ...item,
  }));

  const handleSelectionChange = (newSelectionIds) => {
    const selectedRows = publicationData.filter((row, index) =>
      newSelectionIds.includes(index)
    );

    setSelectedItems(selectedRows);
    setSelectionModal(newSelectionIds);
  };

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
          loading={loading}
          rowSelectionModel={selectionModal}
          onRowSelectionModelChange={handleSelectionChange}
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

PublicationGroupGrid.propTypes = {
  publicationData: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
};
export default PublicationGroupGrid;
