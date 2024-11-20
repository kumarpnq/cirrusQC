import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import KeywordView from "./KeywordView";
import AddEditDialog from "./AddEditDialog";

const BooleanGrid = () => {
  const [openKeywordView, setOpenKeywordView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const rows = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    company: `Company ${index + 1}`,
    keyword: `Keyword ${index + 1}`,
  }));

  // Columns for the DataGrid
  const columns = [
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="edit"
            onClick={() => setOpenEdit((prev) => !prev)}
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
          onClick={() => setOpenKeywordView((prev) => !prev)}
        >
          <VisibilityIcon className="text-primary" />
        </IconButton>
      ),
    },
    {
      field: "company",
      headerName: "Company",
    },
  ];

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
        open={openKeywordView}
        handleClose={() => setOpenKeywordView((prev) => !prev)}
      />
      <AddEditDialog
        open={openEdit}
        handleClose={() => setOpenEdit((prev) => !prev)}
        fromWhere="Edit"
      />
    </>
  );
};

export default BooleanGrid;
