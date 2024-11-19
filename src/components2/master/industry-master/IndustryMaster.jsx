import { Box, Divider, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { green, orange } from "@mui/material/colors";
import SearchFilters from "../SearchFilters";
import { Fragment, useState } from "react";
import IndustryMasterAddEdit from "./IndustryMasterAddEdit";

const IndustryMaster = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const columns = [
    {
      field: "edit",
      headerName: "Edit",
      width: 50,
      renderCell: () => (
        <IconButton onClick={() => setEditOpen((prev) => !prev)}>
          <EditNoteIcon className="text-primary" />
        </IconButton>
      ),
      sortable: false,
    },
    { field: "industryName", headerName: "Industry Name", width: 200 },
    {
      field: "active",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        <span
          style={{ color: params.value === "Yes" ? green[500] : orange[500] }}
        >
          {params.value}
        </span>
      ),
    },
  ];

  const handleClose = () => setOpen(false);
  const handleEditClose = () => setEditOpen(false);

  const rows = [
    { id: 1, industryName: "Finance", active: "Yes" },
    { id: 2, industryName: "Healthcare", active: "No" },
    { id: 3, industryName: "Technology", active: "Yes" },
    { id: 4, industryName: "Retail", active: "No" },
    { id: 5, industryName: "Education", active: "Yes" },
    { id: 6, industryName: "Manufacturing", active: "No" },
    { id: 7, industryName: "Transportation", active: "Yes" },
    { id: 8, industryName: "Agriculture", active: "No" },
    { id: 9, industryName: "Energy", active: "Yes" },
    { id: 10, industryName: "Real Estate", active: "No" },
  ];

  return (
    <Fragment>
      <SearchFilters handleOpen={() => setOpen((prev) => !prev)} />
      <Divider sx={{ my: 1 }} />

      <Box sx={{ height: "80vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          density="compact"
          checkboxSelection
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
        />
      </Box>
      <IndustryMasterAddEdit
        open={open}
        handleClose={handleClose}
        openFromWHere="Add"
      />
      <IndustryMasterAddEdit
        open={editOpen}
        handleClose={handleEditClose}
        openFromWHere="Edit"
      />
    </Fragment>
  );
};

export default IndustryMaster;
