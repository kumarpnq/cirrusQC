import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarExport,
} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import KeywordView from "./KeywordView";
import AddEditDialog from "./AddEditDialog";

const BooleanGrid = ({ data = [], loading }) => {
  const [openEditOrView, setOpenEditOrView] = useState({
    edit: false,
    view: false,
  });
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpen = (row, mode) => {
    setSelectedRow(row);
    setOpenEditOrView((prev) => ({ ...prev, [mode]: true }));
  };

  // Columns for the DataGrid
  const columns = [
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="edit"
            onClick={() => handleOpen(params.row, "edit")}
          >
            <EditNoteIcon className="text-primary" />
          </IconButton>
          <IconButton aria-label="delete" size="small">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
    {
      field: "keyword",
      headerName: "Keyword",
      renderCell: (params) => (
        <IconButton
          aria-label="view"
          onClick={() => handleOpen(params.row, "view")}
        >
          <VisibilityIcon className="text-primary" />
        </IconButton>
      ),
    },
    {
      field: "companyName",
      headerName: "Company",
      width: 300,
    },
  ];

  const rows = data.map((item, index) => ({
    id: index,
    ...item,
  }));

  return (
    <>
      <div style={{ height: "80vh", width: "100%", marginTop: 4 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          density="compact"
          loading={loading}
          slots={{
            toolbar: () => (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <GridToolbarExport />
                <GridToolbarQuickFilter />
              </div>
            ),
          }}
          hideFooterSelectedRowCount
        />
      </div>
      <KeywordView
        open={openEditOrView.view}
        handleClose={() =>
          setOpenEditOrView({
            edit: false,
            view: false,
          })
        }
        row={selectedRow}
      />
      <AddEditDialog
        open={openEditOrView.edit}
        handleClose={() =>
          setOpenEditOrView({
            edit: false,
            view: false,
          })
        }
        fromWhere="Edit"
        row={selectedRow}
      />
    </>
  );
};

BooleanGrid.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default BooleanGrid;
