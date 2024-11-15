import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CustomToolbar } from "../../../@core/CustomGridToolExportAndFilter";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { Fragment, useState } from "react";
import UserAddEditModal from "./UserAddEditModal";

const UserGrid = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([
    {
      id: 1,
      userType: "Client",
      userName: "Bharti Realty",
      loginName: "FTPRTR_BHART1RE7",
      active: true,
    },
    {
      id: 2,
      userType: "Admin",
      userName: "Global Tech Solutions",
      loginName: "ADM_GTSOL123",
      active: true,
    },
    {
      id: 3,
      userType: "Client",
      userName: "Sunshine Enterprises",
      loginName: "CLNT_SUNENP202",
      active: false,
    },
    {
      id: 4,
      userType: "Admin",
      userName: "Innovative Systems",
      loginName: "ADM_INNOSYS01",
      active: true,
    },
    {
      id: 5,
      userType: "Client",
      userName: "MegaCorp Industries",
      loginName: "CLNT_MEGACORP2",
      active: true,
    },
    {
      id: 6,
      userType: "Client",
      userName: "Vista Solutions",
      loginName: "CLNT_VISTASOL44",
      active: false,
    },
    {
      id: 7,
      userType: "Admin",
      userName: "TechnoCore",
      loginName: "ADM_TECHCOR3X",
      active: true,
    },
    {
      id: 8,
      userType: "Client",
      userName: "Future Ventures",
      loginName: "CLNT_FUTURE123",
      active: true,
    },
    {
      id: 9,
      userType: "Admin",
      userName: "Prime Solutions",
      loginName: "ADM_PRIME01",
      active: false,
    },
    {
      id: 10,
      userType: "Client",
      userName: "Elite Technologies",
      loginName: "CLNT_ELITETECH1",
      active: true,
    },
  ]);

  const handleOpen = () => setOpen((prev) => !prev);

  const columns = [
    {
      field: "edit",
      headerName: "Edit",
      renderCell: () => (
        <IconButton color="primary" onClick={handleOpen}>
          <EditNoteIcon />
        </IconButton>
      ),
      width: 70,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: () => (
        <IconButton onClick={() => alert("Record deleted.")}>
          <DeleteIcon />
        </IconButton>
      ),
      width: 70,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "active",
      headerName: "Active",
      renderCell: (params) => (
        <Box
          sx={{
            color: params.row.active ? "green" : "orange",
            fontWeight: "bold",
          }}
        >
          {params.row.active ? "Yes" : "No"}
        </Box>
      ),
      width: 100,
    },
    { field: "userType", headerName: "User Type", width: 150 },
    { field: "userName", headerName: "User Name", width: 150 },
    { field: "loginName", headerName: "Login Name", width: 150 },
  ];

  return (
    <Fragment>
      <Box sx={{ height: "70vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          density="compact"
          slots={{
            toolbar: CustomToolbar,
          }}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
        />
      </Box>
      <UserAddEditModal open={open} handleClose={() => setOpen(false)} />
    </Fragment>
  );
};

export default UserGrid;
